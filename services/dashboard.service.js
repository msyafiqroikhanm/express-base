const { Op } = require('sequelize');
const {
  PAR_Participant, REF_Region, PAR_Contingent, ENV_Event, PAR_Group, TPT_Vehicle,
  TPT_Driver, TPT_Vendor, TPT_VehicleSchedule,
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

const transportationDashboard = async (limitation = null) => {
  // vendor
  const vendors = await TPT_Vendor.findAll({
    attributes: ['name'],
    include: [
      { model: TPT_Driver, as: 'drivers', attributes: ['id'] },
      { model: TPT_Vehicle, as: 'vehicles', attributes: ['id'] },
    ],
  });
  const vendor = vendors.map((data) => ({
    name: data.name, vehicles: data.vehicles.length, drivers: data.drivers.length,
  }));

  // vehicle
  const totalVehicle = await TPT_Vehicle.count({ include: { model: TPT_Vendor, as: 'vendor', required: true } });
  const totalAvailableVehicle = await TPT_Vehicle.count({ where: { isAvailable: true }, include: { model: TPT_Vendor, as: 'vendor', required: true } });

  // driver
  const totalDriver = await TPT_Driver.count({ include: { model: TPT_Vendor, as: 'vendor', required: true } });
  const totalAvailableDriver = await TPT_Driver.count({ where: { isAvailable: true }, include: { model: TPT_Vendor, as: 'vendor', required: true } });

  // schedules
  const todaySchedules = await TPT_VehicleSchedule.count({
    where: {
      pickUpTime: {
        [Op.gte]: new Date().setHours(0, 0, 0, 0),
        [Op.lte]: new Date().setHours(23, 59, 59, 999),
      },
    },
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
    todaySchedules,
  };
};

const selectDashboard = async (limitation, models = []) => {
  const dashboard = [];

  if (models.includes('Participant Management')) {
    const participant = await participantDasboard(limitation?.contingent || null);
    dashboard.push({ participant });
  }
  if (models.includes('Transportation Management')) {
    const transportation = await transportationDashboard(limitation?.vendor || null);
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
