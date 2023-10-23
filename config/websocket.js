const socketIo = require('socket.io');

const { Op } = require('sequelize');
const {
  SYS_Configuration,
  SYS_Notification,
  TPT_DriverTracking,
  TPT_VehicleSchedule,
  PAR_Participant,
  USR_User,
} = require('../models');

const initializeSocketIO = async (server) => {
  const CLIENT_URL = await SYS_Configuration.findOne({ where: { name: 'Client URL' } });
  const io = socketIo(server, {
    cors: {
      origin: CLIENT_URL?.value ? CLIENT_URL.value : '*',
    },
  });

  // Register the connection event
  io.on('connection', (socket) => {
    console.log('WebSocket connected', socket.id);

    // websocket to join user personal room for notification, schedule, etc
    socket.on('joinUserPersonalRoom', async ({ userId }) => {
      try {
        const userInstance = await USR_User.findOne({ where: { id: userId } });
        if (userInstance) {
          socket.join(`user-${userInstance.id}`);
          console.log('Success Joining User Personal Room');
        } else {
          console.log('Failed Joining User Personal Room');
        }
      } catch (error) {
        console.log('Error Joining User Personal Room');
        console.log(error);
      }
    });

    // websocket to join room of transportation schedule
    socket.on('joinTransportationScheduleRoom', async ({ scheduleId }) => {
      try {
        const scheduleInstance = await TPT_VehicleSchedule.findOne({ where: { id: scheduleId } });
        if (scheduleInstance) {
          socket.join(`transportation-schedule-${scheduleId}`);
          console.log('Success Joining Transportation Room');
        } else {
          console.log("Failed Joining Transportation Schedule Room, Schedule Doesn't Exist");
        }
      } catch (error) {
        console.log('Error Joining Transportation Schedule Room');
        console.log(error);
      }
    });

    // websocket to join room of transportation schedule
    socket.on('leaveTransportationScheduleRoom', async ({ scheduleId }) => {
      try {
        const scheduleInstance = await TPT_VehicleSchedule.findOne({ where: { id: scheduleId } });
        if (scheduleInstance) {
          socket.leave(`transportation-schedule-${scheduleId}`);
          console.log('Success Leaving Transportation Room');
        } else {
          console.log("Failed Leaving Transportation Schedule Room, Schedule Doesn't Exist");
        }
      } catch (error) {
        console.log('Error Leaving Transportation Schedule Room');
        console.log(error);
      }
    });

    // websocket to keep track of driver location of when serving schedule
    socket.on(
      'updateDriverLocation',
      async ({
        scheduleId, driverId, longtitude, latitude, accuracy,
      }) => {
        try {
          const scheduleInstance = await TPT_VehicleSchedule.findOne({
            where: { id: scheduleId },
            includes: { model: PAR_Participant },
            attributes: ['id', 'statusId', 'driverId'],
          });
          if (!scheduleInstance || [2, 3].includes(Number(scheduleInstance.statusId))) {
            console.log(
              "Failed Keeping Track Of Driver Location, Schedule Doesn't Exist Or Schedule Already Finish",
            );
          } else if (Number(scheduleInstance.driverId) !== Number(driverId)) {
            console.log(
              'Failed Keeping Track Of Driver Location, Driver Not Assigned To The Transportation Schedule',
            );
          } else {
            await TPT_DriverTracking.update(
              {
                latitude: String(latitude),
                longtitude: String(longtitude),
                accuracy: String(accuracy),
                time: new Date(),
              },
              { where: { driverId } },
            );

            io.to(`transportation-schedule-${scheduleId}`).emit('driverMove', {
              type: 'driverLocation',
              latitude,
              longtitude,
              accuracy,
            });
          }
        } catch (error) {
          console.log('Error Keeping Track Of Driver Location');
          console.log(error);
        }
      },
    );

    // * Need More Thinking to make it dynamic
    // to join admins websocket channel room
    // socket.on('joinMainRoom', async (roleName) => {
    //   try {
    //     if (roleName?.includes('Participant')) {
    //       socket.join('');
    //     }
    //   } catch (error) {
    //     console.log(error);
    //     console.log('Error Joining Main / Admin Room');
    //   }
    // });

    socket.on('updateNotifications', async (notifications) => {
      try {
        if (notifications?.length > 0) {
          await SYS_Notification.update(
            { isRead: true },
            {
              where: {
                id: { [Op.in]: notifications },
              },
            },
          );

          console.log('Success Updating Notification Read Status');
        }
        console.log('Failed Updating Notification Read Status');
      } catch (error) {
        console.log(error);
        console.log('Error Updating User Notification');
      }
    });

    socket.on('disconnect', (reason) => console.log('WebSocket disconnected:', reason));

    socket.on('error', (error) => console.error('WebSocket error:', error));
  });

  return io;
};

module.exports = {
  initializeSocketIO,
};
