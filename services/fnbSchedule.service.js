/* eslint-disable no-param-reassign */
const { Op } = require('sequelize');
const {
  FNB_Kitchen,
  PAR_Participant,
  ACM_Location,
  FNB_Courier,
  QRM_QRTemplate,
  QRM_QR,
  FNB_Schedule,
  USR_PIC,
  USR_User,
  REF_FoodScheduleStatus,
  FNB_ScheduleMenu,
} = require('../models');
const { createQR } = require('./qr.service');
const foodScheduleStatus = require('../helpers/foodScheduleStatus.helper');

const selectAllFnBSchedules = async (where) => {
  const fnbScheduleInstances = await FNB_Schedule.findAll({
    where,
    include: [
      {
        model: ACM_Location,
        as: 'destination',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [
          {
            model: ACM_Location,
            as: 'parentLocation',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
        ],
      },
      {
        model: FNB_Kitchen,
        as: 'kitchen',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
      {
        model: QRM_QR,
        as: 'qr',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
      {
        model: FNB_Courier,
        as: 'courier',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
    ],
  });

  await Promise.all(
    fnbScheduleInstances.map(async (schedule) => {
      const picLocation = await USR_PIC.findOne({
        where: { id: schedule.picLocationId },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: {
          model: USR_User,
          as: 'user',
          attributes: ['id'],
          include: {
            model: PAR_Participant,
            as: 'participant',
            attributes: ['name', 'phoneNbr', 'email'],
          },
        },
      });

      // eslint-disable-next-line no-param-reassign
      const picKitchen = await USR_PIC.findOne({
        where: { id: schedule.picKitchenId },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: {
          model: USR_User,
          as: 'user',
          attributes: ['id'],
          include: {
            model: PAR_Participant,
            as: 'participant',
            attributes: ['name', 'phoneNbr', 'email'],
          },
        },
      });

      // eslint-disable-next-line no-param-reassign
      schedule.dataValues.picLocation = picLocation.user.participant;
      schedule.dataValues.picKitchen = picKitchen.user.participant;
    }),
  );

  return {
    success: true,
    message: 'Successfully Getting All FNB Schedule',
    content: fnbScheduleInstances,
  };
};

const selectFnBSchedule = async (id, where) => {
  const fnbScheduleInstance = await FNB_Schedule.findOne({
    where,
    include: [
      {
        model: ACM_Location,
        as: 'destination',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [
          {
            model: ACM_Location,
            as: 'parentLocation',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
        ],
      },
      {
        model: FNB_Kitchen,
        as: 'kitchen',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
      {
        model: QRM_QR,
        as: 'qr',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
      {
        model: FNB_Courier,
        as: 'courier',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
    ],
  });

  if (!fnbScheduleInstance) {
    return {
      success: false,
      code: 404,
      message: 'FnB Schedule Data Not Found',
    };
  }

  const picLocation = await USR_PIC.findOne({
    where: { id: fnbScheduleInstance.picLocationId },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    include: {
      model: USR_User,
      as: 'user',
      attributes: ['id'],
      include: {
        model: PAR_Participant,
        as: 'participant',
        attributes: ['name', 'phoneNbr', 'email'],
      },
    },
  });

  const picKitchen = await USR_PIC.findOne({
    where: { id: fnbScheduleInstance.picKitchenId },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    include: {
      model: USR_User,
      as: 'user',
      attributes: ['id'],
      include: {
        model: PAR_Participant,
        as: 'participant',
        attributes: ['name', 'phoneNbr', 'email'],
      },
    },
  });

  fnbScheduleInstance.dataValues.picLocation = picLocation.user.participant;
  fnbScheduleInstance.dataValues.picKitchen = picKitchen.user.participant;

  return {
    success: true,
    message: 'Successfully Getting FnB Schedule',
    content: fnbScheduleInstance,
  };
};

const validateFnBScheduleInputs = async (form, limitation = null) => {
  const invalid400 = [];
  const invalid404 = [];

  //* check kitchenId validity
  const kitchenInstance = await FNB_Kitchen.findByPk(form.kitchenId);
  if (!kitchenInstance) {
    invalid404.push('Kitchen Data Not Found');
  }

  //* check kitchen limitation
  if (Object.keys(limitation).length > 0) {
    if (!limitation.kitchens.includes(Number(kitchenInstance.id))) {
      return {
        isValid: false,
        code: 400,
        message: ['Prohibited To Create Schedule For Other Kitchen'],
      };
    }
  }

  //* check locationId validity
  const locationInstance = await ACM_Location.findByPk(form.locationId);
  if (!locationInstance) {
    invalid404.push('Location Data Not Found');
  }

  //* check courierId validity
  const courierId = await FNB_Courier.findByPk(form.courierId);
  if (!courierId) {
    invalid404.push('Courier Data Not Found');
  }
  if (!courierId.isAvailable) {
    invalid400.push('Courier is not Available');
  }

  if (invalid400.length > 0) {
    return {
      isValid: false,
      code: 400,
      message: invalid400,
    };
  }
  if (invalid404.length > 0) {
    return {
      isValid: false,
      code: 404,
      message: invalid404,
    };
  }

  //* Generate QR
  const templateInstance = await QRM_QRTemplate.findOne({
    where: { name: { [Op.like]: '%FNB%' } },
  });
  const qrInstance = await createQR(
    { templateId: templateInstance?.id || 4 },
    {
      rawFile: `public/images/qrs/qrs-${Date.now()}.png`,
      combineFile: `public/images/qrCombines/combines-${Date.now()}.png`,
    },
  );

  //* Generate Status Id
  const statuses = await foodScheduleStatus().then((status) => [status.proses_penjemputan]);

  return {
    isValid: true,
    form: {
      picLocationId: locationInstance.picId,
      picKitchenId: kitchenInstance.picId,
      qrId: qrInstance.content.id,
      locationId: form.locationId,
      kitchenId: form.kitchenId,
      courierId: form.courierId,
      statusId: statuses[0],
      name: form.name,
      pickUpTime: form.pickUpTime,
      vehiclePlateNo: form.vehiclePlatNo,
    },
  };
};

const createFnBSchedule = async (form) => {
  const fnbScheduleInstance = await FNB_Schedule.create(form);

  await FNB_Courier.update({ isAvailable: false }, { where: { id: form.courierId } });

  return {
    success: true,
    message: 'FnB Schedule Successfully Created',
    content: fnbScheduleInstance,
  };
};

const updateFnBSchedule = async (form, where) => {
  const invalid400 = [];
  const invalid404 = [];

  const formUpdateScheduleInstance = {};

  const fnbScheduleInstance = await FNB_Schedule.findOne({ where });
  if (!fnbScheduleInstance) {
    return {
      success: false,
      code: 404,
      message: 'FnB Schedule Data Not Found',
    };
  }
  const courierIdOld = fnbScheduleInstance.courierId;

  //* check kitchenId validity
  if (form.kitchenId) {
    const kitchenInstance = await FNB_Kitchen.findByPk(form.kitchenId);
    if (!kitchenInstance) {
      invalid404.push('Kitchen Data Not Found');
    }
    formUpdateScheduleInstance.kitchenId = kitchenInstance.id;
    formUpdateScheduleInstance.picKitchenId = kitchenInstance.picId;
  }

  //* check kitchenId validity
  if (form.statusId) {
    const statusId = await REF_FoodScheduleStatus.findByPk(form.statusId);
    if (!statusId) {
      invalid404.push('FNB Schedule Status Data Not Found');
    }
  }

  //* check locationId validity
  if (form.locationId) {
    const locationInstance = await ACM_Location.findByPk(form.locationId);
    if (!locationInstance) {
      invalid404.push('Location Data Not Found');
    }
    formUpdateScheduleInstance.locationId = locationInstance.id;
    formUpdateScheduleInstance.picLocationId = locationInstance.picId;
  }

  //* check courierId validity
  let courierIsUpdate = false;
  let newCourier;
  if (form.courierId) {
    const courierInstance = await FNB_Courier.findByPk(form.courierId);
    if (!courierInstance) {
      invalid404.push('Courier Data Not Found');
    }
    if (!courierInstance.isAvailable) {
      invalid400.push('Courier is not available');
    }

    courierIsUpdate = true;
    newCourier = courierInstance;
  }

  if (invalid400.length > 0) {
    return {
      isValid: false,
      code: 400,
      message: invalid400,
    };
  }
  if (invalid404.length > 0) {
    return {
      isValid: false,
      code: 404,
      message: invalid404,
    };
  }

  formUpdateScheduleInstance.courierId = form.courierId
    ? form.courier
    : fnbScheduleInstance.courierId;
  formUpdateScheduleInstance.statusId = form.statusId
    ? form.statusId
    : fnbScheduleInstance.statusId;
  formUpdateScheduleInstance.pickUpTime = form.pickUpTime
    ? form.pickUpTime
    : fnbScheduleInstance.pickUpTime;
  formUpdateScheduleInstance.dropOffTime = form.dropOffTime
    ? form.dropOffTime
    : fnbScheduleInstance.dropOffTime;
  formUpdateScheduleInstance.vehiclePlateNo = form.vehiclePlatNo
    ? form.vehiclePlatNo
    : fnbScheduleInstance.vehiclePlateNo;

  if (courierIsUpdate) {
    await FNB_Courier.update({ isAvailable: true }, { where: { id: courierIdOld } });
    await FNB_Courier.update({ isAvailable: false }, { where: { id: newCourier.id } });
  }

  return {
    success: true,
    message: 'FnB Schedule Successfully Updated',
    content: fnbScheduleInstance,
  };
};

const deleteFnbSchedule = async (id, where) => {
  const fnbScheduleInstance = await FNB_Schedule.findOne({ where });
  if (!fnbScheduleInstance) {
    return {
      success: false,
      code: 404,
      message: 'FnB Schedule Data Not Found',
    };
  }

  const { name } = fnbScheduleInstance.dataValues;

  await FNB_Courier.update({ isAvailable: true }, { where: { id: fnbScheduleInstance.courierId } });
  await FNB_ScheduleMenu.update(
    { scheduleId: null },
    { where: { scheduleId: fnbScheduleInstance.id } },
  );
  await fnbScheduleInstance.destroy();

  return {
    success: true,
    message: 'FnB Schedule Successfully Deleted',
    content: `FnB Schedule ${name} Successfully Deleted`,
  };
};

module.exports = {
  selectAllFnBSchedules,
  selectFnBSchedule,
  validateFnBScheduleInputs,
  createFnBSchedule,
  updateFnBSchedule,
  deleteFnbSchedule,
};
