const { FNB_Courier } = require('../models');

const selectAllCouriers = async (where) => {
  const courierInstances = await FNB_Courier.findAll({
    where,
  });

  return {
    success: true,
    message: 'Successfully Getting All Courier',
    content: courierInstances,
  };
};

const selectCourier = async (where) => {
  const courierInstance = await FNB_Courier.findOne({
    where,
  });
  if (!courierInstance) {
    return {
      success: false,
      message: 'Courier Data Not Found',
    };
  }

  return {
    success: true,
    message: 'Successfully Getting Detail Courier',
    content: courierInstance,
  };
};

const validateCourierInputs = async (form) => {
  const errorMessages = [];

  // There's nothing to check
  if (errorMessages.length > 0) {
    return { isValid: false, code: 404, message: errorMessages };
  }

  return {
    isValid: true,
    form: {
      name: form.name,
      phoneNbr: form.phoneNbr,
    },
  };
};

const createCourier = async (form) => {
  const courierInstance = await FNB_Courier.create(form);

  return {
    success: true,
    message: 'Courier Successfully Created',
    content: courierInstance,
  };
};

const updateCourier = async (where, form) => {
  // check identity type id validity
  const courierInstance = await FNB_Courier.findOne({ where });
  if (!courierInstance) {
    return {
      success: false,
      message: 'Courier Data Not Found',
    };
  }

  const errorMessages = [];

  // There's nothing to check
  if (errorMessages.length > 0) {
    return { isValid: false, code: 404, message: errorMessages };
  }

  courierInstance.name = form.name ? form.name : courierInstance.name;
  courierInstance.phoneNbr = form.phoneNbr ? form.phoneNbr : courierInstance.phoneNbr;
  await courierInstance.save();

  return {
    success: true,
    message: 'Courier Successfully Updated',
    content: courierInstance,
  };
};

const deleteCourier = async (where) => {
  // check identity type id validity
  const courierInstance = await FNB_Courier.findOne({ where });
  if (!courierInstance) {
    return {
      success: false,
      message: 'Courier Data Not Found',
    };
  }

  await courierInstance.destroy();

  return {
    success: true,
    message: 'Courier Successfully Deleted',
    content: 'Courier Successfully Deleted',
  };
};

module.exports = {
  selectAllCouriers,
  selectCourier,
  validateCourierInputs,
  createCourier,
  updateCourier,
  deleteCourier,
};
