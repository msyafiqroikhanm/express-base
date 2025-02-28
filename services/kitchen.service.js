const { picKitchen } = require('../libraries/picTypes.lib');
const {
  FNB_Kitchen,
  USR_PIC,
  FNB_Schedule,
  FNB_KitchenTarget,
  USR_User,
  PAR_Participant,
} = require('../models');

const selectAllKitchens = async (where) => {
  const kitchens = await FNB_Kitchen.findAll({
    where,
    order: [['name', 'ASC']],
  });

  await Promise.all(
    kitchens.map(async (location) => {
      const pic = await USR_PIC.findOne({
        where: { id: location.picId },
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

      // console.log(JSON.stringify(pic.user, null, 2));
      // eslint-disable-next-line no-param-reassign
      location.dataValues.pic = pic?.user.participant || null;
    }),
  );

  return {
    success: true,
    message: 'Successfully Getting All Kitchen',
    content: kitchens,
  };
};

const selectKitchen = async (where) => {
  const kitchenInstance = await FNB_Kitchen.findOne({
    where,
  });

  const pic = await USR_PIC.findOne({
    where: { id: kitchenInstance.picId },
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
  kitchenInstance.dataValues.pic = pic?.user.participant || null;

  if (!kitchenInstance) {
    return {
      success: false,
      message: 'Kitchen Data Not Found',
    };
  }

  return {
    success: true,
    message: 'Successfully Getting All Kitchen',
    content: kitchenInstance,
  };
};

const validateKitchenInputs = async (form) => {
  const errorMessages = [];
  // console.log(form.picId);

  if (form.picId) {
    const picInstance = await USR_PIC.findOne({ where: { id: form.picId, typeId: picKitchen } });
    if (!picInstance) {
      errorMessages.push('PIC Data Not Found');
    }
  }

  if (errorMessages.length > 0) {
    return { isValid: false, code: 404, message: errorMessages };
  }

  return {
    isValid: true,
    form: {
      picId: form.picId || null,
      name: form.name,
      productionCapacity: form.productionCapacity,
      address: form.address,
      phoneNbr: form.phoneNbr,
      latitude: form.latitude,
      longtitude: form.longtitude,
    },
  };
};

const createKitchen = async (form) => {
  const kitchenInstance = await FNB_Kitchen.create(form);

  return {
    success: true,
    message: 'Kitchen Successfully Created',
    content: kitchenInstance,
  };
};

const updateKitchen = async (where, form) => {
  // check identity  id validity
  const errorMessages = [];

  const kitchenInstance = await FNB_Kitchen.findOne({ where });
  if (!kitchenInstance) {
    return {
      success: false,
      message: 'Kitchen Data Not Found',
    };
  }

  if (form.picId) {
    const picInstance = await USR_PIC.findOne({ where: { id: form.picId } });
    if (!picInstance) {
      errorMessages.push('PIC Data Type Not Found');
    }
  }

  if (errorMessages.length > 0) {
    return { isValid: false, code: 404, message: errorMessages };
  }

  kitchenInstance.picId = form.picId ? form.picId : kitchenInstance.picId;
  kitchenInstance.name = form.name ? form.name : kitchenInstance.name;
  kitchenInstance.productionCapacity = form.productionCapacity
    ? form.productionCapacity
    : kitchenInstance.productionCapacity;
  kitchenInstance.address = form.address ? form.address : kitchenInstance.address;
  kitchenInstance.phoneNbr = form.phoneNbr ? form.phoneNbr : kitchenInstance.phoneNbr;
  kitchenInstance.latitude = form.latitude ? form.latitude : kitchenInstance.latitude;
  kitchenInstance.longtitude = form.longtitude ? form.longtitude : kitchenInstance.longtitude;

  await kitchenInstance.save();

  return {
    success: true,
    message: 'Kitchen Successfully Updated',
    content: kitchenInstance,
  };
};

const deleteKitchen = async (where) => {
  // check identity  id validity
  const Instance = await FNB_Kitchen.findOne({ where });
  if (!Instance) {
    return {
      success: false,
      message: 'Kitchen Data Not Found',
    };
  }

  //* Checking dependencies

  //* Schedule
  await FNB_Schedule.update(
    { kitchenId: null },
    {
      where: {
        kitchenId: where.id,
      },
    },
  );

  //* Facilities
  await FNB_KitchenTarget.update(
    { kitchenId: null },
    {
      where: {
        kitchenId: where.id,
      },
    },
  );

  const { name } = Instance.dataValues;

  await Instance.destroy();

  return {
    success: true,
    message: 'Kitchen Successfully Deleted',
    content: `Kitchen ${name} Successfully Deleted`,
  };
};

module.exports = {
  selectAllKitchens,
  selectKitchen,
  validateKitchenInputs,
  createKitchen,
  updateKitchen,
  deleteKitchen,
};
