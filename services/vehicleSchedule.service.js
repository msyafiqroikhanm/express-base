/* eslint-disable no-param-reassign */
const {
  TPT_VehicleSchedule, TPT_Vehicle, TPT_Driver, TPT_Vendor,
  REF_VehicleScheduleStatus, ACM_Location, PAR_Participant,
  REF_PassengerStatus,
} = require('../models');

const selectAllVehicleSchedule = async () => {
  const schedules = await TPT_VehicleSchedule.findAll({
    include: [
      { model: TPT_Vehicle, attributes: ['name'], as: 'vehicle' },
      { model: TPT_Driver, attributes: ['name'], as: 'driver' },
      { model: REF_VehicleScheduleStatus, attributes: ['name'], as: 'status' },
      { model: ACM_Location, attributes: ['id', 'name', 'address'], as: 'pickUp' },
      { model: ACM_Location, attributes: ['id', 'name', 'address'], as: 'destination' },
    ],
  });

  schedules.forEach((schedule) => {
    schedule.dataValues.vehicle = schedule.vehicle?.dataValues.name;
    schedule.dataValues.driver = schedule.driver?.dataValues.name;
    schedule.dataValues.status = schedule.status?.dataValues.name;
  });

  return {
    success: true,
    message: 'Successfully Getting All Vehicle Schedule',
    content: schedules,
  };
};

const selectVehicleSchedule = async (id) => {
  const scheduleInstance = await TPT_VehicleSchedule.findByPk(id, {
    include: [
      { model: TPT_Vehicle, attributes: ['name'], as: 'vehicle' },
      { model: TPT_Driver, attributes: ['name'], as: 'driver' },
      { model: REF_VehicleScheduleStatus, attributes: ['name'], as: 'status' },
      { model: ACM_Location, attributes: ['id', 'name', 'address'], as: 'pickUp' },
      { model: ACM_Location, attributes: ['id', 'name', 'address'], as: 'destination' },
      {
        model: PAR_Participant,
        attributes: ['id', 'name', 'contingentId', 'typeId', 'committeeTypeId'],
        through: { attributes: ['statusId'] },
      },
    ],
  });
  if (!scheduleInstance) {
    return {
      success: false,
      code: 404,
      message: ['Vehicle Schedule Data Not Found'],
    };
  }

  scheduleInstance.dataValues.vehicle = scheduleInstance.vehicle?.dataValues.name;
  scheduleInstance.dataValues.driver = scheduleInstance.driver?.dataValues.name;
  scheduleInstance.dataValues.status = scheduleInstance.status?.dataValues.name;

  return {
    success: true,
    message: 'Successfully Getting Vehicle Schedule',
    content: scheduleInstance,
  };
};

module.exports = {
  selectAllVehicleSchedule,
  selectVehicleSchedule,
};
