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
const { selesai, selesaiDenganKomplen } = require('../libraries/fnbScheduleStatuses.lib');

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
      schedule.dataValues.picLocation = picLocation?.user?.participant;
      schedule.dataValues.picKitchen = picKitchen?.user?.participant;
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

  fnbScheduleInstance.dataValues.picLocation = picLocation?.user?.participant;
  fnbScheduleInstance.dataValues.picKitchen = picKitchen?.user?.participant;

  return {
    success: true,
    message: 'Successfully Getting FnB Schedule',
    content: fnbScheduleInstance,
  };
};

const validateFnBScheduleInputs = async (form, limitation = null, id = null) => {
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

  //* check statusId validity
  const statusInstance = await REF_FoodScheduleStatus.findByPk(form.statusId);
  if (!statusInstance) {
    invalid404.push('Status Data Not Found');
  }

  //* check courierId validity
  const courierInstance = await FNB_Courier.findOne(form.courierId);
  if (!courierInstance) {
    invalid404.push('Courier Data Not Found');
  }
  if (id) {
    const scheduleInstance = await FNB_Schedule.findByPk(id);
    if (!courierInstance?.isAvailable && scheduleInstance?.courierId !== courierInstance?.id) {
      invalid400.push('Courier is not Available');
    }
  } else if (!courierInstance?.isAvailable) {
    invalid400.push('Courier is not Available');
  }

  if (form.pickUpTime) {
    if (new Date().getTime() > new Date(form.pickUpTime).getTime()) {
      invalid400.push("Can't Set Pick Up Time In The Past");
    }
  }
  // console.log(JSON.stringify(courierInstance, null, 2));

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

  // //* Generate Status Id
  // const statuses = await foodScheduleStatus().then((status) => [status.proses_penjemputan]);

  return {
    isValid: true,
    form: {
      picLocationId: locationInstance.picId,
      picKitchenId: kitchenInstance.picId,
      qrId: qrInstance.content.id,
      locationId: form.locationId,
      kitchenId: form.kitchenId,
      courierId: form.courierId,
      statusId: form.statusId,
      name: form.name,
      pickUpTime: form.pickUpTime,
      vehiclePlateNo: form.vehiclePlatNo,
    },
  };
};

const createFnBSchedule = async (form) => {
  const fnbScheduleInstance = await FNB_Schedule.create(form);

  if (fnbScheduleInstance) {
    const locationInstance = await ACM_Location.findByPk(form.locationId, { attributes: ['name'] });
    const kitchenInstance = await FNB_Kitchen.findByPk(form.kitchenId, { attributes: ['name'] });

    fnbScheduleInstance.location = locationInstance.dataValues.name;
    fnbScheduleInstance.kitchen = kitchenInstance.dataValues.name;
  }

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

  if (form.pickUpTime) {
    if (new Date().getTime() > new Date(form.pickUpTime).getTime()) {
      invalid400.push("Can't Set Pick Up Time In The Past");
    } else {
      formUpdateScheduleInstance.pickUpTime = form.pickUpTime;
    }
  } else {
    formUpdateScheduleInstance.pickUpTime = fnbScheduleInstance.pickUpTime;
  }

  // console.log(form, formUpdateScheduleInstance);
  if (form.dropOffTime && formUpdateScheduleInstance.pickUpTime) {
    if (
      new Date(form.dropOffTime).getTime() < new Date(formUpdateScheduleInstance.pickUpTime).getTime()
    ) {
      invalid400.push('Drop Off Time should not be faster than Pick Up Time');
    }
  }

  //* check courierId validity
  let courierIsUpdate = false;
  let newCourier;
  if (form.courierId) {
    const courierInstance = await FNB_Courier.findByPk(form.courierId);
    if (!courierInstance) {
      invalid404.push('Courier Data Not Found');
    }
    if (!courierInstance?.isAvailable && courierIdOld !== Number(form.courierId)) {
      invalid400.push('Courier is not available');
    }

    courierIsUpdate = courierIdOld !== Number(form.courierId);
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
    ? form.courierId
    : fnbScheduleInstance.courierId;
  formUpdateScheduleInstance.statusId = form.statusId
    ? form.statusId
    : fnbScheduleInstance.statusId;
  formUpdateScheduleInstance.dropOffTime = form.dropOffTime
    ? form.dropOffTime
    : fnbScheduleInstance.dropOffTime;
  formUpdateScheduleInstance.vehiclePlateNo = form.vehiclePlatNo
    ? form.vehiclePlatNo
    : fnbScheduleInstance.vehiclePlateNo;

  await FNB_Schedule.update(formUpdateScheduleInstance, { where: { id: fnbScheduleInstance.id } });

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

const updateProgressFnBSchedule = async (form, where) => {
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

  //* check kitchenId validity
  const statusId = await REF_FoodScheduleStatus.findOne({ where: { id: form.statusId } });
  if (!statusId) {
    invalid404.push('FNB Schedule Status Data Not Found');
  }

  fnbScheduleInstance.status = statusId.dataValues.name;

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

  if (Number(form.statusId) === selesai || Number(form.statusId) === selesaiDenganKomplen) {
    console.log({ test: 'test' });
    const courierInstance = await FNB_Courier.findOne({
      where: { id: fnbScheduleInstance.courierId },
    });
    console.log(JSON.stringify(courierInstance));
    courierInstance.isAvailable = true;
    await courierInstance.save();
  }

  formUpdateScheduleInstance.statusId = form.statusId;
  fnbScheduleInstance.statusId = Number(form.statusId);

  await FNB_Schedule.update(formUpdateScheduleInstance, { where: { id: fnbScheduleInstance.id } });
  return {
    success: true,
    message: 'Progress FnB Schedule Successfully Updated',
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
  updateProgressFnBSchedule,
  deleteFnbSchedule,
};
