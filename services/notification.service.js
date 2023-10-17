/* eslint-disable no-param-reassign */
const { Op } = require('sequelize');
const {
  SYS_Notification, SYS_NotificationType, USR_Role, USR_User, SYS_Configuration,
  PAR_Participant, PAR_Group, ACM_ParticipantLodger, TPT_VehicleSchedule, USR_PIC,
  ACM_Location, REF_PICType, ACM_Room, FNB_Schedule, ENV_Event, TPT_Vendor, TPT_Vehicle,
  TPT_Driver, FNB_Kitchen, FNB_KitchenTarget, FNB_Courier,
} = require('../models');

const selectAllNotification = async (id) => {
  const data = await SYS_Notification.findAll({
    where: { userId: id, isRead: false },
    include: { model: SYS_NotificationType, attributes: ['name'], as: 'type' },
  });

  data.forEach((element) => {
    element.dataValues.type = element.type?.dataValues.name || null;
  });

  return {
    success: true,
    message: 'Successfully Getting All Notifications',
    content: data,
  };
};

const proccessNotificationData = async (typeName) => {
  const BASE_URL = await SYS_Configuration.findOne({ where: { name: 'Base URL' } });

  const notificationTypeInstance = await SYS_NotificationType.findOne({
    where: { name: typeName },
    attributes: ['url', 'relatedTable', 'messageFormat'],
    include: {
      model: USR_Role, attributes: ['id'], include: { model: USR_User, attributes: ['id'] }, through: { attributes: ['limitation'] },
    },
  });

  if (!notificationTypeInstance) {
    console.log(`Notification Not Found For Type ${typeName}`);
    return {
      error: true,
    };
  }

  // make group of user by the same limitation
  const outputArray = [];
  notificationTypeInstance?.USR_Roles.forEach((role) => {
    const { limitation } = role.SYS_RoleNotificationSubscription;
    const users = role.USR_Users.map((user) => user.id);

    // Check if an object with the same limitation already exists in the outputArray
    const existingObject = outputArray.find((obj) => obj.limitation === limitation);

    if (existingObject) {
    // If an object with the same limitation exists, add users to it
      existingObject.users.push(...users);
    } else {
    // If not, create a new object with the limitation and users
      outputArray.push({ limitation, users });
    }
  });

  return {
    notifications: outputArray,
    notificationTypeId: notificationTypeInstance.id,
    dataType: notificationTypeInstance.relatedTable?.toLowerCase() || null,
    BASE_URL,
    dataUrl: notificationTypeInstance.url,
    messageFormat: notificationTypeInstance.messageFormat,
  };
};

const sendNotification = async (io, userId, completeUrl, message) => {
  io.to(`user-${userId}`).emit('newNotification', { message, url: completeUrl });
};

const createNotifications = async (io, type, relatedDataId, messageVariable) => {
  const {
    notifications, notificationTypeId, dataType, BASE_URL, dataUrl, messageFormat, error,
  } = await proccessNotificationData(type);

  if (error) {
    return;
  }

  let message = messageFormat;
  messageVariable.forEach((variable, index) => {
    message = message.replace(`{{${index + 1}}}`, variable);
  });

  await Promise.all(notifications.map(async (notification) => {
    if (notification.limitation?.toLowerCase() === 'contingent') {
      // check if user that will recieve notification
      // belongs to the same contingent as the related data
      notification.users.map(async (user) => {
        const userInstance = await USR_User.findOne({
          where: { id: user },
          attributes: ['id', 'participantId'],
          include: {
            model: PAR_Participant, attributes: ['id', 'contingentId'], as: 'participant', required: true,
          },
        });
        if (dataType === 'participant') {
          // * related to table participant
          const participantInstance = await PAR_Participant.findOne({
            where: { id: relatedDataId }, attributes: ['contingentId'],
          });

          if (userInstance?.participant?.contingentId === participantInstance?.contingentId) {
            await SYS_Notification.create({
              typeId: notificationTypeId,
              userId: user,
            }).then(
              await sendNotification(io, user, `${BASE_URL.value}${dataUrl}${relatedDataId}`, message),
            );
          }
        } else if (dataType === 'group') {
          // * related to table group
          const groupInstance = await PAR_Group.findOne({
            where: { id: relatedDataId }, attributes: ['contingentId'],
          });

          if (userInstance?.participant?.contingentId === groupInstance?.contingentId) {
            await SYS_Notification.create({
              typeId: notificationTypeId,
              userId: user,
            }).then(
              await sendNotification(io, user, `${BASE_URL.value}${dataUrl}${relatedDataId}`, message),
            );
          }
        } else if (dataType === 'lodger') {
          // * related to table lodger
          const lodgerInstance = await ACM_ParticipantLodger.findOne({
            where: { id: relatedDataId },
            include: {
              model: PAR_Participant, as: 'participant', attributes: ['contingentId'], required: true,
            },
          });

          if (userInstance?.participant?.contingentId
              === lodgerInstance?.participant?.contingentId) {
            await SYS_Notification.create({
              typeId: notificationTypeId,
              userId: user,
            }).then(
              await sendNotification(io, user, `${BASE_URL.value}${dataUrl}${relatedDataId}`, message),
            );
          }
        } else if (dataType === 'vehicle-schedule') {
          // * related to table vehicle schedule
          const scheduleInstance = await TPT_VehicleSchedule.findOne({
            where: { id: relatedDataId },
            include: { model: PAR_Participant, attributes: ['contingentId'], through: { attributes: [] } },
          });

          if (scheduleInstance?.PAR_Participants?.some(
            (participant) => participant.contingentId === userInstance?.participant?.contingentId,
          )) {
            await SYS_Notification.create({
              typeId: notificationTypeId,
              userId: user,
            }).then(
              await sendNotification(io, user, `${BASE_URL.value}${dataUrl}${relatedDataId}`, message),
            );
          }
        }
      });
    } else if (notification.limitation?.toLowerCase() === 'location') {
      // check if user that will recieve notification
      // belongs to the same location as the related data
      notification.users.map(async (user) => {
        const userInstance = await USR_User.findOne({
          where: { id: user },
          attributes: ['id', 'participantId'],
          include: {
            model: USR_PIC, attributes: ['id', 'typeId'], as: 'PIC', include: { model: REF_PICType, attributes: ['name'] },
          },
        });

        let pics = userInstance?.PIC?.map((pic) => {
          if (pic?.REF_PICType.name?.includes('Location')) {
            return pic.id;
          }
          return null;
        });

        pics = pics.filter((pic) => pic !== null);

        const locationInstance = await ACM_Location.findAll({
          where: { picId: { [Op.in]: pics } }, attributes: ['id', 'picId'],
        });

        if (dataType === 'lodger') {
          // * related to table lodger
          const lodgerInstance = await ACM_ParticipantLodger.findOne({
            where: { id: relatedDataId },
            attributes: ['id', 'roomId'],
            include: {
              model: ACM_Room, attributes: ['locationId'], as: 'room', required: true,
            },
          });

          if (locationInstance.some(
            (location) => location.id === lodgerInstance?.room?.locationId,
          )) {
            await SYS_Notification.create({
              typeId: notificationTypeId,
              userId: user,
            }).then(
              await sendNotification(io, user, `${BASE_URL.value}${dataUrl}${relatedDataId}`, message),
            );
          }
        } else if (dataType === 'fnb-schedule') {
          // * related to table fnb schedule
          const scheduleInstance = await FNB_Schedule.findOne({ where: { id: relatedDataId }, attributes: ['locationId'] });

          if (locationInstance.some(
            (location) => location.id === scheduleInstance?.locationId,
          )) {
            await SYS_Notification.create({
              typeId: notificationTypeId,
              userId: user,
            }).then(
              await sendNotification(io, user, `${BASE_URL.value}${dataUrl}${relatedDataId}`, message),
            );
          }
        }
      });
    } else if (notification.limitation?.toLowerCase() === 'event') {
      // check if user that will recieve notification
      // belongs to the same event as the related data
      notification.users.map(async (user) => {
        const userInstance = await USR_User.findOne({
          where: { id: user },
          attributes: ['id', 'participantId'],
          include: {
            model: USR_PIC, attributes: ['id', 'typeId'], as: 'PIC', include: { model: REF_PICType, attributes: ['name'] },
          },
        });

        let pics = userInstance?.PIC?.map((pic) => {
          if (pic?.REF_PICType.name?.includes('Event')) {
            return pic.id;
          }
          return null;
        });

        pics = pics.filter((pic) => pic !== null);

        const events = await ENV_Event.findAll({
          where: { picId: { [Op.in]: pics } }, attributes: ['id', 'picId'],
        });

        if (dataType === 'group') {
          // * related to table lodger
          const groupInstance = await PAR_Group.findOne({
            where: { id: relatedDataId }, attributes: ['id', 'eventId'],
          });

          if (events.some(
            (event) => event.id === groupInstance?.eventId,
          )) {
            await SYS_Notification.create({
              typeId: notificationTypeId,
              userId: user,
            }).then(
              await sendNotification(io, user, `${BASE_URL.value}${dataUrl}${relatedDataId}`, message),
            );
          }
        }
      });
    } else if (notification.limitation?.toLowerCase() === 'vendor') {
      // check if user that will recieve notification
      // belongs to the same event as the related data
      notification.users.map(async (user) => {
        const userInstance = await USR_User.findOne({
          where: { id: user },
          attributes: ['id', 'participantId'],
          include: {
            model: USR_PIC, attributes: ['id', 'typeId'], as: 'PIC', include: { model: REF_PICType, attributes: ['name'] },
          },
        });

        let pics = userInstance?.PIC?.map((pic) => {
          if (pic?.REF_PICType.name?.includes('Transportation')) {
            return pic.id;
          }
          return null;
        });

        pics = pics.filter((pic) => pic !== null);

        const vendors = await TPT_Vendor.findAll({
          where: { picId: { [Op.in]: pics } }, attributes: ['id', 'picId'],
        });

        if (dataType === 'vehicle') {
          // * related to table lodger
          const vehicleInstance = await TPT_Vehicle.findOne({ where: { id: relatedDataId }, attributes: ['id', 'vendorId'] });

          if (vendors.some((vendor) => vendor.id === vehicleInstance.vendorId)) {
            await SYS_Notification.create({
              typeId: notificationTypeId,
              userId: user,
            }).then(
              await sendNotification(io, user, `${BASE_URL.value}${dataUrl}${relatedDataId}`, message),
            );
          }
        } else if (dataType === 'driver') {
          // * related to table driver
          const driverInstance = await TPT_Driver.findOne({
            where: { id: relatedDataId }, attributes: ['id', 'vendorId'],
          });

          if (vendors.some((vendor) => vendor.id === driverInstance.vendorId)) {
            await SYS_Notification.create({
              typeId: notificationTypeId,
              userId: user,
            }).then(
              await sendNotification(io, user, `${BASE_URL.value}${dataUrl}${relatedDataId}`, message),
            );
          }
        } else if (dataType === 'vehicle-schedule') {
          // * related to table vehicle schedule
          const scheduleInstance = await TPT_VehicleSchedule.findOne({
            where: { id: relatedDataId }, attributes: ['id', 'driverId', 'vehicleId'],
          });

          let vendorId = null;
          if (scheduleInstance?.driverId) {
            const driverInstance = await TPT_Driver.findOne({
              where: { id: scheduleInstance.driverId }, attributes: ['id', 'vendorId'],
            });

            vendorId = driverInstance.vendorId;
          } else if (scheduleInstance?.vehicleId) {
            const vehicleInstance = await TPT_Vehicle.findOne({
              where: { id: scheduleInstance.vehicleId }, attributes: ['id', 'vendorId'],
            });

            vendorId = vehicleInstance.vendorId;
          }

          if (vendors.some((vendor) => vendor.id === vendorId)) {
            await SYS_Notification.create({
              typeId: notificationTypeId,
              userId: user,
            }).then(
              await sendNotification(io, user, `${BASE_URL.value}${dataUrl}${relatedDataId}`, message),
            );
          }
        }
      });
    } else if (notification.limitation?.toLowerCase() === 'driver') {
      // check if user that will recieve notification
      // belongs to the same event as the related data
      notification.users.map(async (user) => {
        const userInstance = await USR_User.findOne({
          where: { id: user },
          attributes: ['id', 'participantId'],
          include: {
            model: TPT_Driver, attributes: ['id'], as: 'driver',
          },
        });

        if (dataType === 'vehicle-schedule') {
          // * related to table vehicle schedule
          const scheduleInstance = await TPT_VehicleSchedule.findOne({
            where: { id: relatedDataId }, attributes: ['id', 'driverId'],
          });

          if (scheduleInstance?.driverId === userInstance?.driver?.id) {
            await SYS_Notification.create({
              typeId: notificationTypeId,
              userId: user,
            }).then(
              await sendNotification(io, user, `${BASE_URL.value}${dataUrl}${relatedDataId}`, message),
            );
          }
        }
      });
    } else if (notification.limitation?.toLowerCase() === 'kitchen') {
      // check if user that will recieve notification
      // belongs to the same event as the related data
      notification.users.map(async (user) => {
        const userInstance = await USR_User.findOne({
          where: { id: user },
          attributes: ['id', 'participantId'],
          include: {
            model: USR_PIC, attributes: ['id', 'typeId'], as: 'PIC', include: { model: REF_PICType, attributes: ['name'] },
          },
        });

        let pics = userInstance?.PIC?.map((pic) => {
          if (pic?.REF_PICType.name?.includes('Kitchen')) {
            return pic.id;
          }
          return null;
        });

        pics = pics.filter((pic) => pic !== null);

        const kitchens = await FNB_Kitchen.findAll({
          where: { picId: { [Op.in]: pics } }, attributes: ['id', 'picId'],
        });

        if (dataType === 'kitchen-target') {
          const targetInstance = await FNB_KitchenTarget.findOne({ where: { id: relatedDataId }, attributes: ['id', 'kitchenId'] });

          if (kitchens.some((kitchen) => kitchen.id === targetInstance.kitchenId)) {
            await SYS_Notification.create({
              typeId: notificationTypeId,
              userId: user,
            }).then(
              await sendNotification(io, user, `${BASE_URL.value}${dataUrl}${relatedDataId}`, message),
            );
          }
        } else if (dataType === 'fnb-schedule') {
          const scheduleInstance = await FNB_Schedule.findOne({ where: { id: relatedDataId }, attributes: ['id', 'kitchenId'] });

          if (kitchens.some((kitchen) => kitchen.id === scheduleInstance.kitchenId)) {
            await SYS_Notification.create({
              typeId: notificationTypeId,
              userId: user,
            }).then(
              await sendNotification(io, user, `${BASE_URL.value}${dataUrl}${relatedDataId}`, message),
            );
          }
        }
      });
    } else if (notification.limitation?.toLowerCase() === 'courier') {
      // check if user that will recieve notification
      // belongs to the same event as the related data
      notification.users.map(async (user) => {
        const userInstance = await USR_User.findOne({
          where: { id: user },
          attributes: ['id', 'participantId'],
          include: {
            model: FNB_Courier, attributes: ['id'], as: 'courier',
          },
        });

        if (dataType === 'fnb-schedule') {
          // * related to table fnb schedule
          const scheduleInstance = await FNB_Schedule.findOne({
            where: { id: relatedDataId }, attributes: ['id', 'courierId'],
          });

          if (scheduleInstance?.courierId === userInstance?.courier?.id) {
            await SYS_Notification.create({
              typeId: notificationTypeId,
              userId: user,
            }).then(
              await sendNotification(io, user, `${BASE_URL.value}${dataUrl}${relatedDataId}`, message),
            );
          }
        }
      });
    } else {
      notification.users.map(async (user) => {
        await SYS_Notification.create({
          typeId: notificationTypeId,
          userId: user,
        }).then(
          await sendNotification(io, user, `${BASE_URL.value}${dataUrl}${relatedDataId}`, message),
        );
      });
    }
  }));
};

module.exports = {
  selectAllNotification,
  createNotifications,
};
