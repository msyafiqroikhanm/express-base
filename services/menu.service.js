const {
  FNB_Menu,
  REF_MenuType,
  REF_FoodType,
  FNB_KitchenTarget,
  FNB_ScheduleMenu,
} = require('../models');

const selectAllMenus = async (where) => {
  const menuInstance = await FNB_Menu.findAll({
    where,
    order: [
      ['date', 'DESC'],
      ['name', 'ASC'],
    ],
    include: [
      {
        model: REF_MenuType,
        as: 'menuType',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
      {
        model: REF_FoodType,
        as: 'foodType',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
      {
        model: FNB_Menu,
        as: 'parent',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
      {
        model: FNB_Menu,
        as: 'child',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
    ],
  });

  return {
    success: true,
    message: 'Successfully Getting All Menu',
    content: menuInstance,
  };
};

const selectMenu = async (where) => {
  const menuInstance = await FNB_Menu.findOne({
    where,
    include: [
      {
        model: REF_MenuType,
        as: 'menuType',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
      {
        model: REF_FoodType,
        as: 'foodType',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
      {
        model: FNB_Menu,
        as: 'parent',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
      {
        model: FNB_Menu,
        as: 'child',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
    ],
  });
  if (!menuInstance) {
    return {
      success: false,
      message: 'Menu Data Not Found',
    };
  }

  return {
    success: true,
    message: 'Successfully Getting All Menu',
    content: menuInstance,
  };
};

const validateMenuInputs = async (form) => {
  const errorMessages = [];

  if (form.parentMenuId) {
    const menuInstance = await FNB_Menu.findOne({ where: { id: form.parentMenuId } });
    if (!menuInstance) {
      errorMessages.push('Parent Menu Data Not Found');
    }
  }

  const menuTypeInstance = await REF_MenuType.findOne({ where: { id: form.menuTypeId } });
  if (!menuTypeInstance) {
    errorMessages.push('Menu Type Data Not Found');
  }

  const foodTypeInstance = await REF_FoodType.findOne({ where: { id: form.foodTypeId } });
  if (!foodTypeInstance) {
    errorMessages.push('Food Type Data Not Found');
  }

  if (errorMessages.length > 0) {
    return { isValid: false, code: 404, message: errorMessages };
  }

  return {
    isValid: true,
    form: {
      parentMenuId: form.parentMenuId ? form.parentMenuId : null,
      menuTypeId: form.menuTypeId,
      foodTypeId: form.foodTypeId,
      date: form.date,
      name: form.name,
      quantity: form.quantity,
      description: form.description,
    },
  };
};

const createMenu = async (form) => {
  const menuInstance = await FNB_Menu.create(form);

  return {
    success: true,
    message: 'Menu Successfully Created',
    content: menuInstance,
  };
};

const updateMenu = async (where, form) => {
  // check identity  id validity
  const errorMessages = [];

  const menuInstance = await FNB_Menu.findOne({ where });
  if (!menuInstance) {
    return {
      success: false,
      message: 'Menu Data Not Found',
    };
  }

  if (form.parentMenuId) {
    const parentMenuInstance = await FNB_Menu.findOne({ where: { id: form.parentMenuId } });
    if (!parentMenuInstance) {
      errorMessages.push('Parent Menu Data Not Found');
    }
  }

  if (form.menuTypeId) {
    const menuTypeInstance = await REF_MenuType.findOne({ where: { id: form.menuTypeId } });
    if (!menuTypeInstance) {
      errorMessages.push('Menu Type Data Not Found');
    }
  }

  if (form.foodTypeId) {
    const foodTypeInstance = await REF_FoodType.findOne({ where: { id: form.foodTypeId } });
    if (!foodTypeInstance) {
      errorMessages.push('Food Type Data Not Found');
    }
  }

  if (errorMessages.length > 0) {
    return { isValid: false, code: 404, message: errorMessages };
  }

  menuInstance.parentMenuId = form.parentMenuId ? form.parentMenuId : menuInstance.parentMenuId;
  menuInstance.menuTypeId = form.menuTypeId ? form.menuTypeId : menuInstance.menuTypeId;
  menuInstance.foodTypeId = form.foodTypeId ? form.menuTypeId : menuInstance.menuTypeId;
  menuInstance.date = form.date ? form.date : menuInstance.date;
  menuInstance.name = form.name ? form.name : menuInstance.name;
  menuInstance.quantity = form.quantity ? form.quantity : menuInstance.quantity;
  menuInstance.description = form.description ? form.description : menuInstance.description;

  await menuInstance.save();

  return {
    success: true,
    message: 'Menu Successfully Updated',
    content: menuInstance,
  };
};

const deleteMenu = async (where) => {
  // check identity  id validity
  const menuInstance = await FNB_Menu.findOne({ where });
  if (!menuInstance) {
    return {
      success: false,
      message: 'Menu Data Not Found',
    };
  }

  //* Checking dependencies

  //* Schedule Menu
  await FNB_ScheduleMenu.update(
    { menuId: null },
    {
      where: {
        menuId: where.id,
      },
    },
  );

  //* Kitchen Target
  await FNB_KitchenTarget.update(
    { menuId: null },
    {
      where: {
        menuId: where.id,
      },
    },
  );

  // await menuInstance.destroy();

  return {
    success: true,
    message: 'Menu Successfully Deleted',
    content: `Menu ${menuInstance.dataValues.name} Successfully Deleted`,
  };
};

module.exports = {
  selectAllMenus,
  selectMenu,
  validateMenuInputs,
  createMenu,
  updateMenu,
  deleteMenu,
};
