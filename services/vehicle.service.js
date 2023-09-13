/* eslint-disable no-param-reassign */
const { Op } = require('sequelize');
const {
  TPT_Vehicle, TPT_Vendor, REF_VehicleType, QRM_QR, QRM_QRTemplate,
} = require('../models');
const { createQR } = require('./qr.service');

const validateVehicleQuery = async (query) => {
  const parsedQuery = {};

  if (typeof query.available !== 'undefined') {
    parsedQuery.isAvailable = query.available.toLowerCase() === 'true';
  }

  if (query.vendor) {
    const vendorInstace = await TPT_Vendor.findOne({ where: { name: { [Op.like]: `%${query.vendor}%` } } });
    parsedQuery.vendorId = vendorInstace?.id || null;
  }

  return parsedQuery;
};

const validateVehicleInputs = async (form) => {
  const {
    vendorId, typeId, vehicleNo, vehiclePlateNo, name, capacity,
  } = form;

  const vendorInstace = await TPT_Vendor.findByPk(vendorId);
  if (!vendorInstace) {
    return {
      isValid: false,
      code: 404,
      message: 'Vendor Data Not Found',
    };
  }

  const typeInstance = await REF_VehicleType.findByPk(typeId);
  if (!typeInstance) {
    return {
      isValid: false,
      code: 404,
      message: 'Vehicle Type Data Not Found',
    };
  }

  return {
    isValid: true,
    form: {
      vendor: vendorInstace,
      type: typeInstance,
      vehicleNo,
      vehiclePlateNo,
      name,
      capacity: Number(capacity),
    },
  };
};

const selectAllVehicles = async (query) => {
  const data = await TPT_Vehicle.findAll({
    where: query,
    include: [
      { model: TPT_Vendor, as: 'vendor', attributes: ['name'] },
      { model: REF_VehicleType, as: 'type', attributes: ['name'] },
      { model: QRM_QR, as: 'qr', attributes: ['code', 'rawFile'] },
    ],
  });

  data.forEach((vehicle) => {
    vehicle.dataValues.vendor = vehicle.vendor.dataValues.name;
    vehicle.dataValues.type = vehicle.type.dataValues.name;
  });

  return {
    success: true,
    message: 'Successfully Getting All Vehicle',
    content: data,
  };
};

const selectVehicle = async (id) => {
  const vehicleInstance = await TPT_Vehicle.findByPk(id, {
    include: [
      { model: TPT_Vendor, as: 'vendor', attributes: ['name'] },
      { model: REF_VehicleType, as: 'type', attributes: ['name'] },
      { model: QRM_QR, as: 'qr', attributes: ['code', 'rawFile'] },
    ],
  });
  if (!vehicleInstance) {
    return {
      success: false,
      code: 404,
      message: 'Vehicle Data Not Found',
    };
  }

  vehicleInstance.dataValues.vendor = vehicleInstance.vendor.dataValues.name;
  vehicleInstance.dataValues.type = vehicleInstance.type.dataValues.name;

  return {
    success: true,
    message: 'Successfully Getting Vehicle',
    content: vehicleInstance,
  };
};

const createVehicle = async (form) => {
  // QR setup for transportation
  const templateInstance = await QRM_QRTemplate.findOne({ where: { name: { [Op.like]: '%transportation%' } } });
  const qrInstance = await createQR({ templateId: templateInstance?.id || 1 }, { rawFile: `public/images/qrs/qrs-${Date.now()}.png`, combineFile: `public/images/qrCombines/combines-${Date.now()}.png` });

  // create vehicle
  const vehicleInstance = await TPT_Vehicle.create({
    vendorId: form.vendor?.id,
    typeId: form.type?.id,
    qrId: qrInstance?.content.id,
    vehicleNo: form.vehicleNo,
    vehiclePlateNo: form.vehiclePlateNo,
    name: form.name,
    capacity: form.capacity,
    isAvailable: true,
  });

  return {
    success: true,
    message: 'Vehicle Successfully Created',
    content: vehicleInstance,
  };
};

const updateVehicle = async (form, id) => {
  const vehicleInstance = await TPT_Vehicle.findByPk(id);
  if (!vehicleInstance) {
    return {
      success: false,
      code: 404,
      message: 'Vehicle Data Not Found',
    };
  }

  vehicleInstance.vendorId = form.vendor?.id;
  vehicleInstance.typeId = form.type?.id;
  vehicleInstance.vehicleNo = form.vehicleNo;
  vehicleInstance.vehiclePlateNo = form.vehiclePlateNo;
  vehicleInstance.name = form.name;
  vehicleInstance.capacity = form.capacity;
  await vehicleInstance.save();

  return {
    success: true,
    message: 'Vehicle Successfully Updated',
    content: vehicleInstance,
  };
};

const deleteVehicle = async (id) => {
  const vehicleInstance = await TPT_Vehicle.findByPk(id);
  if (!vehicleInstance) {
    return {
      success: false,
      code: 404,
      message: 'Vehicle Data Not Found',
    };
  }

  const { name } = vehicleInstance.dataValues;

  await vehicleInstance.destroy();

  return {
    success: true,
    message: 'Vehicle Successfully Deleted',
    content: `Vehicle ${name} Successfully Deleted`,
  };
};

module.exports = {
  validateVehicleInputs,
  validateVehicleQuery,
  selectAllVehicles,
  selectVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
