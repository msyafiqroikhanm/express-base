/* eslint-disable no-param-reassign */
const { Op } = require('sequelize');
const {
  PAR_Participant, REF_Region, PAR_Contingent, ENV_Event, PAR_Group, TPT_Vehicle,
  TPT_Driver, TPT_Vendor, TPT_VehicleSchedule, REF_VehicleScheduleStatus, ACM_Location,
} = require('../models');

const participantDasboard = async (limitation = null) => {
  const totalParticipant = await PAR_Participant.count({
    where: limitation ? { contingentId: limitation.id } : { contingentId: { [Op.not]: null } },
  });

  // * Participant / Region
  const participantPerRegion = await REF_Region.findAll({
    attributes: ['id', 'name'],
    include: [
      {
        model: PAR_Contingent,
        as: 'contingents',
        where: limitation ? { id: limitation.id } : null,
        attributes: ['id'],
        include: {
          model: PAR_Participant,
          as: 'participants',
          attributes: ['id'],
        },
      },
    ],
  });

  const regionCounts = participantPerRegion.map((region) => {
    const participantCount = region.contingents.reduce(
      (sum, contingent) => sum + Number(contingent.participants?.length),
      0,
    );
    return {
      id: region.id,
      name: region.name,
      participantCount,
    };
  });

  // * Participant / Event
  const participantPerEvent = await ENV_Event.findAll({
    attributes: ['id', 'name'],
    include: [
      {
        model: PAR_Group,
        include: {
          model: PAR_Participant,
          where: limitation ? { contingentId: limitation.id } : null,
          attributes: ['id'],
        },
      },
    ],
  });
  const eventCounts = participantPerEvent.map((event) => {
    const participantCount = event.PAR_Groups.reduce(
      (sum, contingent) => sum + Number(contingent.PAR_Participants?.length),
      0,
    );
    if (limitation && participantCount === 0) {
      return null;
    }
    return {
      id: event.id,
      name: event.name,
      participantCount,
    };
  });

  return {
    totalParticipant,
    participantPerRegion: regionCounts,
    participantPerEvent: eventCounts?.filter((event) => event !== null) || null,
  };
};

const transportationDashboard = async (limitation = {}) => {
  // vendor
  const vendors = await TPT_Vendor.findAll({
    attributes: ['name'],
    where: limitation?.vendors.length > 0 ? { id: { [Op.in]: limitation.vendors } } : null,
    include: [
      { model: TPT_Driver, as: 'drivers', attributes: ['id'] },
      { model: TPT_Vehicle, as: 'vehicles', attributes: ['id'] },
    ],
  });
  const vendor = vendors.map((data) => ({
    name: data.name, vehicles: data.vehicles.length, drivers: data.drivers.length,
  }));

  // vehicle
  const totalVehicle = await TPT_Vehicle.count({
    where: limitation?.vendors.length > 0 ? { vendorId: { [Op.in]: limitation.vendors } } : null,
    include: { model: TPT_Vendor, as: 'vendor', required: true },
  });
  const totalAvailableVehicle = await TPT_Vehicle.count({
    where: limitation?.vendors.length > 0
      ? { isAvailable: true, vendorId: { [Op.in]: limitation.vendors } } : { isAvailable: true },
    include: { model: TPT_Vendor, as: 'vendor', required: true },
  });

  // driver
  const totalDriver = await TPT_Driver.count({
    where: limitation?.vendors.length > 0 ? { vendorId: { [Op.in]: limitation.vendors } } : null,
    include: { model: TPT_Vendor, as: 'vendor', required: true },
  });
  const totalAvailableDriver = await TPT_Driver.count({
    where: limitation?.vendors.length > 0
      ? { isAvailable: true, vendorId: { [Op.in]: limitation.vendors } } : { isAvailable: true },
    include: { model: TPT_Vendor, as: 'vendor', required: true },
  });

  // schedules
  const todaySchedules = await TPT_VehicleSchedule.findAll({
    order: [
      ['statusId', 'ASC'],
      ['pickUpTime', 'DESC'],
    ],
    attributes: ['name', 'pickUpTime', 'dropOffTime', 'description'],
    where: {
      pickUpTime: {
        [Op.gte]: new Date().setHours(0, 0, 0, 0),
        [Op.lte]: new Date().setHours(23, 59, 59, 999),
      },
    },
    include: [
      {
        model: TPT_Vehicle,
        attributes: ['name'],
        as: 'vehicle',
        include: { model: TPT_Vendor, attributes: ['name'], as: 'vendor' },
        where: limitation?.vendors.length > 0
          ? { vendorId: { [Op.in]: limitation.vendors } } : null,
      },
      {
        model: TPT_Driver,
        attributes: ['name'],
        as: 'driver',
        include: { model: TPT_Vendor, attributes: ['name'], as: 'vendor' },
        where: limitation?.vendors.length > 0
          ? { vendorId: { [Op.in]: limitation.vendors } } : null,
      },
      { model: REF_VehicleScheduleStatus, attributes: ['name'], as: 'status' },
      {
        model: ACM_Location,
        attributes: ['name', 'address'],
        as: 'pickUp',
      },
      {
        model: ACM_Location,
        attributes: ['name', 'address'],
        as: 'destination',
      },
    ],
  });
  todaySchedules?.forEach((schedule) => {
    if (schedule.vehicle) {
      schedule.vehicle.dataValues.vendor = schedule.vehicle.vendor?.dataValues.name || null;
    }
    if (schedule.driver) {
      schedule.driver.dataValues.vendor = schedule.driver.vendor?.dataValues.name || null;
    }
  });

  const TotalTodaySchedules = await TPT_VehicleSchedule.count({
    where: {
      pickUpTime: {
        [Op.gte]: new Date().setHours(0, 0, 0, 0),
        [Op.lte]: new Date().setHours(23, 59, 59, 999),
      },
    },
    include: [
      {
        model: TPT_Vehicle,
        attributes: ['name'],
        as: 'vehicle',
        include: { model: TPT_Vendor, attributes: ['name'], as: 'vendor' },
        where: limitation?.vendors.length > 0
          ? { vendorId: { [Op.in]: limitation.vendors } } : null,
      },
      {
        model: TPT_Driver,
        attributes: ['name'],
        as: 'driver',
        include: { model: TPT_Vendor, attributes: ['name'], as: 'vendor' },
        where: limitation?.vendors.length > 0
          ? { vendorId: { [Op.in]: limitation.vendors } } : null,
      },
    ],
  });

  return {
    vendor,
    vehicle: {
      totalVehicle,
      totalAvailableVehicle,
    },
    driver: {
      totalDriver,
      totalAvailableDriver,
    },
    schedule: {
      TotalTodaySchedules,
      todaySchedules,
    },
  };
};

const selectDashboard = async (limitation, modules = []) => {
  const dashboard = [];

  if (modules.includes('Participant Management')) {
    const participant = await participantDasboard(limitation?.contingent || null);
    dashboard.push({ participant });
  }
  if (modules.includes('Transportation Management')) {
    const transportation = await transportationDashboard(limitation?.transportation || null);
    dashboard.push({ transportation });
  }
  return {
    success: true,
    message: 'Successfully Getting Dashboard',
    content: dashboard,
  };
};

module.exports = {
  selectDashboard,
};
