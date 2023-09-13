/* eslint-disable no-param-reassign */
const { TPT_Driver, TPT_Vendor } = require('../models');

const selectAllDrivers = async () => {
  const data = await TPT_Driver.findAll({
    include: { model: TPT_Vendor, as: 'vendor', attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] } },
  });

  data.forEach((driver) => {
    driver.dataValues.vendor = driver.vendor.dataValues.name;
  });

  return {
    success: true,
    message: 'Successfully Getting All Driver',
    content: data,
  };
};

const selectDriver = async (id) => {
  const driverInstance = await TPT_Driver.findByPk(id, {
    include: { model: TPT_Vendor, as: 'vendor', attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] } },
  });
  if (!driverInstance) {
    return {
      success: false,
      code: 404,
      message: 'Driver Data Not Found',
    };
  }

  driverInstance.dataValues.vendor = driverInstance.vendor.dataValues.name;

  return {
    success: true,
    message: 'Successfully Getting Driver',
    content: driverInstance,
  };
};

const validateDriverInputs = async (form) => {
  const {
    vendorId, name, phoneNbr, email,
  } = form;

  // check vendor id
  const vendorInstance = await TPT_Vendor.findByPk(vendorId);
  if (!vendorInstance) {
    return {
      success: false,
      code: 404,
      message: 'Vendor Data Not Found',
    };
  }

  return {
    isValid: true,
    form: {
      vendor: vendorInstance,
      name,
      phoneNbr,
      email,
    },
  };
};

const createDriver = async (form) => {
  const driverInstance = await TPT_Driver.create({
    vendorId: form.vendor.id,
    name: form.name,
    phoneNbr: form.phoneNbr,
    email: form.email,
    isAvailable: true,
  });

  return {
    success: true,
    message: 'Driver Successfully Deleted',
    content: driverInstance,
  };
};

const updateDriver = async (form, id) => {
  const driverInstance = await TPT_Driver.findByPk(id);
  if (!driverInstance) {
    return {
      success: false,
      code: 404,
      message: 'Driver Data Not Found',
    };
  }

  driverInstance.vendorId = form.vendor.id;
  driverInstance.name = form.name;
  driverInstance.phoneNbr = form.phoneNbr;
  driverInstance.email = form.email;
  await driverInstance.save();

  return {
    success: true,
    message: 'Driver Successfully Updated',
    content: driverInstance,
  };
};

const deleteDriver = async (id) => {
  const driverInstance = await TPT_Driver.findByPk(id);
  if (!driverInstance) {
    return {
      success: false,
      code: 404,
      message: 'Driver Data Not Found',
    };
  }

  const { name } = driverInstance.dataValues;

  await driverInstance.destroy();

  return {
    success: true,
    message: 'Driver Successfully Deleted',
    content: `Driver ${name} Successfully Deleted`,
  };
};

module.exports = {
  selectAllDrivers,
  selectDriver,
  validateDriverInputs,
  createDriver,
  updateDriver,
  deleteDriver,
};
