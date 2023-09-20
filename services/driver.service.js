/* eslint-disable no-param-reassign */
const { Op } = require('sequelize');
const { TPT_Driver, TPT_Vendor, TPT_VehicleSchedule } = require('../models');

const selectAllDrivers = async (where = {}) => {
  const data = await TPT_Driver.findAll({
    // eslint-disable-next-line no-nested-ternary
    where: where.driverId ? { id: where.driverId } : where.picId
      ? { vendorId: { [Op.in]: where.vendors } } : null,
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

const selectDriver = async (id, where) => {
  if (where.driverId && where.driverId !== Number(id)) {
    return {
      success: false,
      code: 404,
      message: ['Driver Data Not Found'],
    };
  }

  const driverInstance = await TPT_Driver.findOne({
    where: where.picId ? { id, vendorId: { [Op.in]: where.vendors } } : { id },
    include: { model: TPT_Vendor, as: 'vendor', attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] } },
  });
  if (!driverInstance) {
    return {
      success: false,
      code: 404,
      message: ['Driver Data Not Found'],
    };
  }

  driverInstance.dataValues.vendor = driverInstance.vendor.dataValues.name;

  return {
    success: true,
    message: 'Successfully Getting Driver',
    content: driverInstance,
  };
};

const validateDriverInputs = async (form, where) => {
  const {
    vendorId, name, phoneNbr, email,
  } = form;

  if (where.picId && !where.vendors?.includes(vendorId)) {
    return {
      success: false,
      code: 404,
      message: ['Vendor Data Not Found'],
    };
  }

  // check vendor id
  const vendorInstance = await TPT_Vendor.findByPk(vendorId);
  if (!vendorInstance) {
    return {
      success: false,
      code: 404,
      message: ['Vendor Data Not Found'],
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

const updateDriver = async (form, id, where) => {
  const driverInstance = await TPT_Driver.findOne({
    where: where.picId ? { id, vendorId: { [Op.in]: where.vendors } } : { id },
  });
  if (!driverInstance) {
    return {
      success: false,
      code: 404,
      message: ['Driver Data Not Found'],
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

const deleteDriver = async (id, where) => {
  const driverInstance = await TPT_Driver.findOne({
    where: where.picId ? { id, vendorId: { [Op.in]: where.vendors } } : { id },
  });
  if (!driverInstance) {
    return {
      success: false,
      code: 404,
      message: ['Driver Data Not Found'],
    };
  }

  const { name } = driverInstance.dataValues;

  await driverInstance.destroy();

  await TPT_VehicleSchedule.update(
    { driverId: null },
    { where: { driverId: driverInstance.id, dropOffTime: null } },
  );

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
