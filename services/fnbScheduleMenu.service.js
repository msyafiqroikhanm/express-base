/* eslint-disable no-param-reassign */
const {
  FNB_Kitchen,
  ACM_Location,
  FNB_Courier,
  QRM_QR,
  FNB_Schedule,
  FNB_ScheduleMenu,
  FNB_Menu,
  FNB_KitchenTarget,
  REF_MenuType,
  REF_FoodType,
} = require('../models');

const selectAllFnBScheduleMenus = async (where) => {
  const fnbScheduleMenuInstances = await FNB_ScheduleMenu.findAll({
    include: [
      {
        model: FNB_KitchenTarget,
        as: 'kitchenTarget',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
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
                attributes: { exclude: ['createdAt', 'updatedAt'] },
              },
              {
                model: REF_FoodType,
                as: 'foodType',
                attributes: { exclude: ['createdAt', 'updatedAt'] },
              },
            ],
          },
        ],
      },
      {
        model: FNB_Schedule,
        as: 'schedule',
        where,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
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
      },
    ],
  });

  return {
    success: true,
    message: 'Successfully Getting All FNB Schedule Menu',
    content: fnbScheduleMenuInstances,
  };
};

const selectFnBScheduleMenu = async (id, where) => {
  const fnbScheduleMenuInstance = await FNB_ScheduleMenu.findOne({
    where: { id },
    include: [
      {
        model: FNB_KitchenTarget,
        as: 'kitchenTarget',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
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
                attributes: { exclude: ['createdAt', 'updatedAt'] },
              },
              {
                model: REF_FoodType,
                as: 'foodType',
                attributes: { exclude: ['createdAt', 'updatedAt'] },
              },
            ],
          },
        ],
      },
      {
        model: FNB_Schedule,
        as: 'schedule',
        where,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
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
      },
    ],
  });

  if (!fnbScheduleMenuInstance) {
    return {
      success: false,
      code: 404,
      message: 'FnB Schedule Menu Data Not Found',
    };
  }

  return {
    success: true,
    message: 'Successfully Getting FnB Schedule Menu',
    content: fnbScheduleMenuInstance,
  };
};

const validateFnBScheduleMenuInputs = async (form, limitation = null) => {
  const invalid400 = [];
  const invalid404 = [];

  //* check scheduleId validity
  const scheduleInstance = await FNB_Schedule.findByPk(form.scheduleId);
  if (!scheduleInstance) {
    invalid404.push('FnB Schedule Data Not Found');
  }

  //* check kitchen limitation
  if (Object.keys(limitation).length > 0) {
    if (!limitation.kitchens.includes(Number(scheduleInstance.kitchenId))) {
      return {
        isValid: false,
        code: 400,
        message: ['Prohibited To Create Schedule Menu For Other Kitchen'],
      };
    }
  }

  //* check kitchenTargetId validity
  const kitchenTargetInstance = await FNB_KitchenTarget.findByPk(form.kitchenTargetId);
  if (!kitchenTargetInstance) {
    invalid404.push('Kitchen Target Data Not Found');
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

  return {
    isValid: true,
    form: {
      scheduleId: form.scheduleId,
      kitchenTargetId: form.kitchenTargetId,
      quantity: form.quantity,
    },
  };
};

const createFnBScheduleMenu = async (form) => {
  const fnbScheduleMenuInstance = await FNB_ScheduleMenu.create(form);

  return {
    success: true,
    message: 'FnB Schedule Menu Successfully Created',
    content: fnbScheduleMenuInstance,
  };
};

const updateFnBScheduleMenu = async (form, where) => {
  const invalid400 = [];
  const invalid404 = [];

  const fnbScheduleMenuInstance = await FNB_ScheduleMenu.findOne({ where });
  if (!fnbScheduleMenuInstance) {
    return {
      success: false,
      code: 404,
      message: 'FnB Schedule Menu Data Not Found',
    };
  }

  //* check menuId validity
  if (form.menuId) {
    const menuInstance = await FNB_Menu.findByPk(form.menuId);
    if (!menuInstance) {
      invalid404.push('Menu Data Not Found');
    }
  }

  //* check scheduleId validity
  if (form.scheduleId) {
    const scheduleInstance = await FNB_Schedule.findByPk(form.scheduleId);
    if (!scheduleInstance) {
      invalid404.push('FNB Schedule Data Not Found');
    }
  }

  //* check scheduleId validity
  if (form.isValid) {
    const scheduleInstance = await FNB_Schedule.findByPk(form.scheduleId);
    if (!scheduleInstance) {
      invalid404.push('FNB Schedule Data Not Found');
    }
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

  fnbScheduleMenuInstance.scheduleId = form.scheduleId
    ? form.scheduleId
    : fnbScheduleMenuInstance.scheduleId;
  fnbScheduleMenuInstance.kitchenTargetId = form.kitchenTargetId
    ? form.kitchenTargetId
    : fnbScheduleMenuInstance.kitchenTargetId;
  fnbScheduleMenuInstance.quantity = form.quantity
    ? form.quantity
    : fnbScheduleMenuInstance.quantity;
  fnbScheduleMenuInstance.isValid = Number(form.isValid) === 1;
  fnbScheduleMenuInstance.note = form.note ? form.note : fnbScheduleMenuInstance.note;

  await fnbScheduleMenuInstance.save();

  return {
    success: true,
    message: 'FnB Schedule Menu Successfully Updated',
    content: fnbScheduleMenuInstance,
  };
};

const deleteFnbScheduleMenu = async (where) => {
  const fnbScheduleMenuInstance = await FNB_ScheduleMenu.findOne({ where });
  if (!fnbScheduleMenuInstance) {
    return {
      success: false,
      code: 404,
      message: 'FnB Schedule Menu Data Not Found',
    };
  }

  await fnbScheduleMenuInstance.destroy();

  return {
    success: true,
    message: 'FnB Schedule Menu Successfully Deleted',
    content: 'FnB Schedule Menu Successfully Deleted',
  };
};

module.exports = {
  selectAllFnBScheduleMenus,
  selectFnBScheduleMenu,
  validateFnBScheduleMenuInputs,
  createFnBScheduleMenu,
  updateFnBScheduleMenu,
  deleteFnbScheduleMenu,
};
