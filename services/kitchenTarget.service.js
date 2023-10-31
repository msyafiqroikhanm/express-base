const {
  FNB_Kitchen,
  FNB_KitchenTarget,
  FNB_Menu,
  REF_MenuType,
  REF_FoodType,
} = require('../models');

const selectAllKitchenTargets = async (where) => {
  const kitchens = await FNB_KitchenTarget.findAll({
    where,
    order: [
      ['kitchenId', 'ASC'],
      ['name', 'ASC'],
    ],
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
  const invalid400 = [];

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

  if (form.quantityTarget && kitchenInstance.productionCapacity) {
    if (Number(form.quantityTarget) > Number(kitchenInstance.productionCapacity)) {
      invalid400.push('Quantity Target Cannot Be Greater Than Kitchen Production Capacity');
    }
  }

  if (invalid400.length) {
    return { isValid: false, code: 400, message: invalid400 };
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
  const kitchenTargetInstance = await FNB_KitchenTarget.create(form);

  const menuInstance = await FNB_Menu.findOne({ where: { id: form.menuId }, attributes: ['name'] });
  const kitchenInstance = await FNB_Kitchen.findOne({
    where: { id: form.kitchenId },
    attributes: ['name'],
  });

  kitchenTargetInstance.menu = menuInstance.dataValues.name || null;
  kitchenTargetInstance.kitchen = kitchenInstance.dataValues.name || null;

  return {
    success: true,
    message: 'KitchenTarget Successfully Created',
    content: kitchenTargetInstance,
  };
};

const updateKitchenTarget = async (where, form) => {
  // check identity  id validity
  const errorMessages = [];
  const invalid400 = [];

  const kitchenTargetInstance = await FNB_KitchenTarget.findOne({ where });
  if (!kitchenTargetInstance) {
    errorMessages.push('Data Kitchen Target Not Found');
  }

  let kitchenInstance = await FNB_Kitchen.findOne({
    where: { id: kitchenTargetInstance.kitchenId },
  });
  // console.log(JSON.stringify(kitchenTargetInstance, null, 2));

  if (form.menuId) {
    const menuInstance = await FNB_Menu.findOne({ where: { id: form.menuId } });
    if (!menuInstance) {
      errorMessages.push('Menu Data Not Found');
    }
  }

  if (form.kitchenId) {
    kitchenInstance = await FNB_Kitchen.findOne({ where: { id: form.kitchenId } });
    if (!kitchenInstance) {
      errorMessages.push('Kitchen Data Not Found');
    }
  }

  if (errorMessages.length > 0) {
    return { success: false, code: 404, message: errorMessages };
  }

  if (form.quantityTarget && kitchenInstance.productionCapacity) {
    if (Number(form.quantityTarget) > Number(kitchenInstance.productionCapacity)) {
      invalid400.push('Quantity Target Cannot Be Greater Than Kitchen Production Capacity');
    }
  }

  if (invalid400.length) {
    return { success: false, code: 400, message: invalid400 };
  }

  kitchenTargetInstance.menuId = form.menuId ? form.menuId : kitchenTargetInstance.menuId;
  kitchenTargetInstance.kitchenId = form.kitchenId
    ? form.kitchenId
    : kitchenTargetInstance.kitchenId;
  kitchenTargetInstance.date = form.date ? form.date : kitchenTargetInstance.date;
  kitchenTargetInstance.quantityTarget = form.quantityTarget
    ? form.quantityTarget
    : kitchenTargetInstance.quantityTarget;
  kitchenTargetInstance.quantityActual = form.quantityActual
    ? form.quantityActual
    : kitchenTargetInstance.quantityActual;

  await kitchenTargetInstance.save();

  return {
    success: true,
    message: 'Kitchen Target Successfully Updated',
    content: kitchenTargetInstance,
  };
};

const progressActualKitchenTarget = async (where, form) => {
  // check identity  id validity
  const errorMessages = [];

  const kitchenTargetInstance = await FNB_KitchenTarget.findOne({ where });
  if (!kitchenTargetInstance) {
    errorMessages.push('Data Kitchen Target Not Found');
  }

  if (errorMessages.length > 0) {
    return { isValid: false, code: 404, message: errorMessages };
  }

  const kitchenInstance = await FNB_Kitchen.findOne({
    where: { id: kitchenTargetInstance?.kitchenId },
    attributes: ['name'],
  });
  const menuInstance = await FNB_Menu.findOne({
    where: { id: kitchenTargetInstance?.menuId },
    attributes: ['name'],
  });

  kitchenTargetInstance.quantityActual = form.quantityActual;
  kitchenTargetInstance.kitchen = kitchenInstance?.name || null;
  kitchenTargetInstance.menu = menuInstance?.name || null;

  await kitchenTargetInstance.save();

  return {
    success: true,
    message: 'Kitchen Target Successfully Updated',
    content: kitchenTargetInstance,
  };
};

const deleteKitchenTarget = async (where) => {
  // check identity  id validity
  const Instance = await FNB_KitchenTarget.findOne({ where });
  if (!Instance) {
    return {
      success: false,
      message: 'Kitchen Target Data Not Found',
    };
  }

  //* Checking dependencies
  // there are no dependencies

  await Instance.destroy();

  return {
    success: true,
    message: 'Kitchen Target Successfully Deleted',
    content: 'Kitchen Target Successfully Deleted',
  };
};

module.exports = {
  selectAllKitchenTargets,
  selectKitchenTarget,
  validateKitchenTargetInputs,
  createKitchenTarget,
  updateKitchenTarget,
  deleteKitchenTarget,
  progressActualKitchenTarget,
};
