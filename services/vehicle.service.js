/* eslint-disable no-param-reassign */
const { Op } = require('sequelize');
const {
  TPT_Vehicle,
  TPT_Vendor,
  REF_VehicleType,
  QRM_QR,
  QRM_QRTemplate,
  TPT_VehicleSchedule,
  TPT_Driver,
  ACM_Location,
  REF_VehicleScheduleStatus,
  TPT_VehicleTracking,
} = require('../models');
const { createQR } = require('./qr.service');

const validateVehicleQuery = async (query) => {
  const parsedQuery = {};

  if (typeof query.isAvailable !== 'undefined') {
    parsedQuery.isAvailable = query.isAvailable.toLowerCase() === 'true';
  }

  return parsedQuery;
};

const validateVehicleInputs = async (form, where, id) => {
  const { vendorId, typeId, vehicleNo, vehiclePlateNo, name, capacity } = form;

  const invalid400 = [];
  const invalid404 = [];

  if (where.picId && !where.vendors?.includes(Number(vendorId))) {
    return {
      success: false,
      code: 404,
      message: ['Vendor Data Not Found'],
    };
  }

  const vendorInstace = await TPT_Vendor.findByPk(vendorId);
  if (!vendorInstace) {
    invalid404.push('Vendor Data Not Found');
  }

  const typeInstance = await REF_VehicleType.findByPk(typeId);
  if (!typeInstance) {
    invalid404.push('Vehicle Type Data Not Found');
  }

  const duplicatePlateNo = await TPT_Vehicle.findOne({
    where: id ? { id: { [Op.ne]: id }, vehiclePlateNo } : { vehiclePlateNo },
  });
  if (duplicatePlateNo) {
    invalid400.push('Vehicle Plate No Already Exist / Taken');
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
      vendor: vendorInstace,
      type: typeInstance,
      vehicleNo,
      vehiclePlateNo,
      name,
      capacity: Number(capacity),
      isAvailable: typeof form.isAvailable !== 'undefined' ? form.isAvailable : null,
    },
  };
};

const selectAllVehicles = async (query, where) => {
  const parsedQuery = {};
  if (Object.keys(query).length > 0) {
    parsedQuery.isAvailable = query.isAvailable;
  }
  if (where.picId) {
    parsedQuery.vendorId = { [Op.in]: where.vendors || [] };
  }

  const data = await TPT_Vehicle.findAll({
    where: Object.keys(parsedQuery).length > 0 ? parsedQuery : null,
    order: [
      ['vendorId', 'ASC'],
      ['name', 'ASC'],
    ],
    include: [
      { model: TPT_Vendor, as: 'vendor', attributes: ['name'] },
      { model: REF_VehicleType, as: 'type', attributes: ['name'] },
      { model: QRM_QR, as: 'qr', attributes: ['code', 'rawFile'] },
    ],
  });

  data.forEach((vehicle) => {
    vehicle.dataValues.vendor = vehicle.vendor?.dataValues.name || null;
    vehicle.dataValues.type = vehicle.type?.dataValues.name || null;
  });

  return {
    success: true,
    message: 'Successfully Getting All Vehicle',
    content: data,
  };
};

const selectVehicle = async (id, where) => {
  const vehicleInstance = await TPT_Vehicle.findOne({
    where: where.picId ? { id, vendorId: { [Op.in]: where.vendors } } : { id },
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
      message: ['Vehicle Data Not Found'],
    };
  }

  vehicleInstance.dataValues.vendor = vehicleInstance.vendor?.dataValues.name || null;
  vehicleInstance.dataValues.type = vehicleInstance.type?.dataValues.name || null;

  return {
    success: true,
    message: 'Successfully Getting Vehicle',
    content: vehicleInstance,
  };
};

const createVehicle = async (form) => {
  // QR setup for transportation
  const templateInstance = await QRM_QRTemplate.findOne({
    where: { name: { [Op.like]: '%vehicle%' } },
  });
  const qrInstance = await createQR(
    { templateId: templateInstance?.id || 1 },
    {
      rawFile: `public/images/qrs/qrs-${Date.now()}.png`,
      combineFile: `public/images/qrCombines/combines-${Date.now()}.png`,
    },
  );

  // create vehicle
  const vehicleInstance = await TPT_Vehicle.create({
    vendorId: form.vendor?.id,
    typeId: form.type?.id,
    qrId: qrInstance?.content.id,
    vehicleNo: form.vehicleNo,
    vehiclePlateNo: form.vehiclePlateNo,
    name: form.name,
    capacity: form.capacity,
    isAvailable: typeof form.isAvailable !== 'object' ? form.isAvailable === 'true' : true,
  });

  vehicleInstance.vendor = form.vendor.dataValues.name;

  return {
    success: true,
    message: 'Vehicle Successfully Created',
    content: vehicleInstance,
  };
};

const updateVehicle = async (form, id, where) => {
  const vehicleInstance = await TPT_Vehicle.findOne({
    where: where.picId ? { id, vendorId: { [Op.in]: where.vendors } } : { id },
  });
  if (!vehicleInstance) {
    return {
      success: false,
      code: 404,
      message: ['Vehicle Data Not Found'],
    };
  }

  vehicleInstance.vendorId = form.vendor?.id;
  vehicleInstance.typeId = form.type?.id;
  vehicleInstance.vehicleNo = form.vehicleNo;
  vehicleInstance.vehiclePlateNo = form.vehiclePlateNo;
  vehicleInstance.name = form.name;
  vehicleInstance.capacity = form.capacity;
  vehicleInstance.isAvailable =
    typeof form.isAvailable !== 'object' ? form.isAvailable === 'true' : true;
  await vehicleInstance.save();

  return {
    success: true,
    message: 'Vehicle Successfully Updated',
    content: vehicleInstance,
  };
};

const deleteVehicle = async (id, where) => {
  const vehicleInstance = await TPT_Vehicle.findOne({
    where: where.picId ? { id, vendorId: { [Op.in]: where.vendors } } : { id },
  });
  if (!vehicleInstance) {
    return {
      success: false,
      code: 404,
      message: ['Vehicle Data Not Found'],
    };
  }

  const { name } = vehicleInstance.dataValues;

  await vehicleInstance.destroy();

  await TPT_VehicleSchedule.update(
    { vehicleId: null },
    { where: { vehicleId: vehicleInstance.id, dropOffTime: null } },
  );

  return {
    success: true,
    message: 'Vehicle Successfully Deleted',
    content: `Vehicle ${name} Successfully Deleted`,
  };
};

const selectVehicleSchedules = async (vehicleId, where) => {
  const vehicleInstance = await TPT_Vehicle.findOne({
    where: where.picId
      ? { id: vehicleId, vendorId: { [Op.in]: where.vendors } }
      : { id: vehicleId },
  });
  if (!vehicleInstance) {
    return {
      success: false,
      code: 404,
      message: ['Vehicle Data Not Found'],
    };
  }

  const schedules = await TPT_VehicleSchedule.findAll({
    where: { vehicleId },
    include: [
      { model: TPT_Driver, attributes: ['name'], as: 'driver' },
      { model: REF_VehicleScheduleStatus, attributes: ['name'], as: 'status' },
      { model: ACM_Location, attributes: ['id', 'name', 'address'], as: 'pickUp' },
      { model: ACM_Location, attributes: ['id', 'name', 'address'], as: 'destination' },
    ],
  });

  schedules.forEach((schedule) => {
    schedule.dataValues.driver = schedule.driver?.dataValues.name;
    schedule.dataValues.status = schedule.status?.dataValues.name;
  });

  return {
    success: true,
    message: 'Successfully Getting All Schedules For a Vehicle',
    content: schedules,
  };
};

const selectVehicleTracks = async (vehicleId, where) => {
  const vehicleInstance = await TPT_Vehicle.findOne({
    where: where.picId
      ? { id: vehicleId, vendorId: { [Op.in]: where.vendors } }
      : { id: vehicleId },
  });
  if (!vehicleInstance) {
    return {
      success: false,
      code: 404,
      message: ['Vehicle Data Not Found'],
    };
  }

  const tracks = await TPT_VehicleTracking.findAll({ where: { vehicleId } });

  return {
    success: true,
    message: 'Successfully Getting All Track For a Vehicle',
    content: tracks,
  };
};

const createTrackingVehicle = async (form, vehicleId, where) => {
  const vehicleInstance = await TPT_Vehicle.findOne({
    where: where.picId
      ? { id: vehicleId, vendorId: { [Op.in]: where.vendors } }
      : { id: vehicleId },
  });
  if (!vehicleInstance) {
    return {
      success: false,
      code: 404,
      message: ['Vehicle Data Not Found'],
    };
  }

  const trackInstance = await TPT_VehicleTracking.create({
    vehicleId,
    latitude: form.latitude,
    longtitude: form.longtitude,
    accuracy: form.accuracy,
    time: new Date(),
  });

  return {
    succes: true,
    message: 'Vehicle Track Successfully Created',
    content: trackInstance,
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
  selectVehicleSchedules,
  selectVehicleTracks,
  createTrackingVehicle,
};
