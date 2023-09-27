const {
  FNB_Kitchen,
  USR_PIC,
  FNB_Schedule,
  FNB_KitchenTarget,
  FNB_Menu,
  REF_MenuType,
  REF_FoodType,
} = require('../models');

const selectAllKitchenTargets = async (where) => {
  const kitchens = await FNB_KitchenTarget.findAll({
    where,
    include: [
      {
        model: FNB_Kitchen,
        as: 'kitchen',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
      {
        model: FNB_Menu,
        as: 'menu',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [
          {
            model: REF_MenuType,
            as: 'menuType',
            attributes: ['id', 'name'],
          },
          {
            model: REF_FoodType,
            as: 'foodType',
            attributes: ['id', 'name'],
          },
        ],
      },
    ],
  });

  return {
    success: true,
    message: 'Successfully Getting All Kitchen Target',
    content: kitchens,
  };
};

const selectKitchenTarget = async (where) => {
  const kitchenInstance = await FNB_KitchenTarget.findOne({
    where,
  });
  if (!kitchenInstance) {
    return {
      success: false,
      message: 'KitchenTarget Data Not Found',
    };
  }

  return {
    success: true,
    message: 'Successfully Getting All KitchenTarget',
    content: kitchenInstance,
  };
};

const validateKitchenTargetInputs = async (form) => {
  const errorMessages = [];

  const menuInstance = await FNB_Menu.findOne({ where: { id: form.menuId } });
  if (!menuInstance) {
    errorMessages.push('Menu Data Not Found');
  }

  const kitchenInstance = await FNB_Kitchen.findOne({ where: { id: form.kitchenId } });
  if (!kitchenInstance) {
    errorMessages.push('Kitchen Data Not Found');
  }

  if (errorMessages.length) {
    return { isValid: false, code: 404, message: errorMessages };
  }

  return {
    isValid: true,
    form: {
      menuId: form.menuId,
      kitchenId: form.kitchenId,
      date: form.date,
      quantityTarget: form.quantityTarget,
    },
  };
};

const createKitchenTarget = async (form) => {
  const kitchenInstance = await FNB_KitchenTarget.create(form);

  return {
    success: true,
    message: 'KitchenTarget Successfully Created',
    content: kitchenInstance,
  };
};

const updateKitchenTarget = async (where, form) => {
  // check identity  id validity
  const errorMessages = [];

  const kitchenInstance = await FNB_KitchenTarget.findOne({ where });
  if (!kitchenInstance) {
    return {
      success: false,
      message: 'KitchenTarget Data Not Found',
    };
  }

  if (form.picId) {
    const picInstance = await USR_PIC.findByPk(form.picId);
    if (!picInstance) {
      errorMessages.push('PIC Data Type Not Found');
    }
  }

  if (errorMessages.length > 0) {
    return { isValid: false, code: 404, message: errorMessages };
  }

  kitchenInstance.picId = form.picId ? form.picId : kitchenInstance.picId;
  kitchenInstance.name = form.name ? form.name : kitchenInstance.name;
  kitchenInstance.address = form.address ? form.address : kitchenInstance.address;
  kitchenInstance.phoneNbr = form.phoneNbr ? form.phoneNbr : kitchenInstance.phoneNbr;
  kitchenInstance.latitude = form.latitude ? form.latitude : kitchenInstance.latitude;
  kitchenInstance.longtitude = form.longtitude ? form.longtitude : kitchenInstance.longtitude;

  await kitchenInstance.save();

  return {
    success: true,
    message: 'KitchenTarget Successfully Updated',
    content: kitchenInstance,
  };
};

const deleteKitchenTarget = async (where) => {
  // check identity  id validity
  const Instance = await FNB_KitchenTarget.findOne({ where });
  if (!Instance) {
    return {
      success: false,
      message: 'KitchenTarget Data Not Found',
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
    message: 'Kitchen Target Successfully Deleted',
    content: `Kitchen Target ${name} Successfully Deleted`,
  };
};

module.exports = {
  selectAllKitchenTargets,
  selectKitchenTarget,
  validateKitchenTargetInputs,
  createKitchenTarget,
  updateKitchenTarget,
  deleteKitchenTarget,
};
