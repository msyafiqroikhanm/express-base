/* eslint-disable no-param-reassign */
const {
  TPT_VehicleSchedule, TPT_Vehicle, TPT_Driver, ACM_Location, PAR_Participant,
  REF_VehicleScheduleStatus, REF_PassengerStatus, TPT_SchedulePassenger, PAR_Contingent,
  REF_CommitteeType, REF_ParticipantType,
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
  const scheduleInstance = await TPT_VehicleSchedule.findOne({
    where: { id },
    include: [
      { model: TPT_Vehicle, attributes: ['name'], as: 'vehicle' },
      { model: TPT_Driver, attributes: ['name'], as: 'driver' },
      { model: REF_VehicleScheduleStatus, attributes: ['name'], as: 'status' },
      { model: ACM_Location, attributes: ['id', 'name', 'address'], as: 'pickUp' },
      { model: ACM_Location, attributes: ['id', 'name', 'address'], as: 'destination' },
      {
        model: TPT_SchedulePassenger,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [
          {
            model: PAR_Participant,
            attributes: ['name', 'contingentId', 'typeId', 'committeeTypeId'],
            include: [
              { model: PAR_Contingent, attributes: ['name'], as: 'contingent' },
              { model: REF_ParticipantType, attributes: ['name'], as: 'participantType' },
              { model: REF_CommitteeType, attributes: ['name'], as: 'committeeType' },
            ],
          },
          {
            model: REF_PassengerStatus,
            as: 'status',
            attributes: ['name'], // Include attributes you need from REF_PassengerStatus
          },
        ],
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

  const passengers = scheduleInstance.TPT_SchedulePassengers.map((passenger) => (
    {
      vehicleScheduleId: passenger.vehicleScheduleId,
      participantId: passenger.participantId,
      statusId: passenger.statusId,
      contingentId: passenger.PAR_Participant.contingentId,
      typeId: passenger.PAR_Participant.typeId,
      committeeTypeId: passenger.PAR_Participant.committeeTypeId,
      name: passenger.PAR_Participant.name,
      contingent: passenger.PAR_Participant.contingent?.name || null,
      participantType: passenger.PAR_Participant.participantType?.name || null,
      committeeType: passenger.PAR_Participant.committeeType?.name || null,
      status: passenger.status?.name || null,
    }
  ));

  scheduleInstance.dataValues.passengers = passengers;
  delete scheduleInstance.dataValues.TPT_SchedulePassengers;

  return {
    success: true,
    message: 'Successfully Getting Vehicle Schedule',
    content: scheduleInstance,
  };
};

const validateVehicleScheduleInputs = async (form) => {
  const invalid400 = [];
  const invalid404 = [];

  // check vehicle id validity
  const vehicleInstance = await TPT_Vehicle.findByPk(form.vehicleId);
  if (!vehicleInstance) {
    invalid404.push('Vehicle Data Not Found');
  }

  // check driver id validity
  const driverInstance = await TPT_Driver.findByPk(form.driverId);
  if (!driverInstance) {
    invalid404.push('Driver Data Not Found');
  }

  // check up pick up (location id) validity
  const pickUpInstance = await ACM_Location.findByPk(form.pickUpId);
  if (!pickUpInstance) {
    invalid404.push('Pick Up Location Id Not Found');
  }

  // check destination (location id) validity
  const destinationInstance = await ACM_Location.findByPk(form.destinationId);
  console.log(JSON.stringify(destinationInstance, null, 2));
  if (!destinationInstance) {
    invalid404.push('Destination Location Id Not Found');
  }

  // check if pick up is the same as destination
  if (form.pickUpId === form.destinationId) {
    invalid400.push('Pick Up Location Can\'t Be Same As Destination Location');
  }

  // check if driver and vehicle belongs to same vendor
  if (vehicleInstance && driverInstance) {
    if (vehicleInstance.vendorId !== driverInstance.vendorId) {
      invalid400.push('Vehicle And Driver Belongs To Different Vendor');
    }
  }

  // check to prevent backdate
  if (new Date().getTime() > new Date(form.pickUpTime).getTime()) {
    invalid400.push('Can\'t Set Pick Up Time In The Past');
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
      vehicle: vehicleInstance,
      driver: driverInstance,
      pickUp: pickUpInstance,
      destination: destinationInstance,
      name: form.name,
      pickUpTime: new Date(form.pickUpTime),
    },
  };
};

const createVehicleSchedule = async (form) => {
  const scheduleInstance = await TPT_VehicleSchedule.create({
    name: form.name,
    vehicleId: form.vehicle?.id,
    driverId: form.driver?.id,
    statusId: 1,
    pickUpId: form.pickUp?.id,
    destinationId: form.destination?.id,
    pickUpTime: form.pickUpTime,
  });

  return {
    success: true,
    message: 'Vehicle Schedule Successfully Created',
    content: scheduleInstance,
  };
};

const updateVehicleSchedule = async (form, id) => {
  const scheduleInstance = await TPT_VehicleSchedule.findByPk(id);
  if (!scheduleInstance) {
    return {
      success: false,
      code: 404,
      message: ['Vehicle Schedule Data Not Found'],
    };
  }

  scheduleInstance.name = form.name;
  scheduleInstance.vehicleId = form.vehicle?.id;
  scheduleInstance.driverId = form.driver?.id;
  scheduleInstance.pickUpId = form.pickUp?.id;
  scheduleInstance.destinationId = form.destination?.id;
  scheduleInstance.pickUpTime = form.pickUpTime;
  await scheduleInstance.save();

  return {
    success: true,
    message: 'Vehicle Schedule Successfully Updated',
    content: scheduleInstance,
  };
};

const progressVehicleSchedule = async (form, id) => {
  const scheduleInstance = await TPT_VehicleSchedule.findByPk(id, {
    include: { model: REF_VehicleScheduleStatus, attributes: ['name'], as: 'status' },
  });
  if (!scheduleInstance) {
    return {
      success: false,
      code: 404,
      message: ['Vehicle Schedule Data Not Found'],
    };
  }

  const statusInstance = await REF_VehicleScheduleStatus.findByPk(form.statusId);

  scheduleInstance.statusId = statusInstance?.id || scheduleInstance.statusId;
  await scheduleInstance.save();

  return {
    success: true,
    message: `Vehicle Schedulee Status Of ${scheduleInstance.name} Successully Updated To ${statusInstance?.name || scheduleInstance.status?.name}`,
    content: scheduleInstance,
  };
};

const deleteVehicleSchedule = async (id) => {
  const scheduleInstance = await TPT_VehicleSchedule.findByPk(id);
  if (!scheduleInstance) {
    return {
      success: false,
      code: 404,
      message: ['Vehicle Schedule Data Not Found'],
    };
  }

  const { name } = scheduleInstance.dataValues;

  await scheduleInstance.destroy();
  await scheduleInstance.setPAR_Participants([]);

  return {
    success: true,
    message: 'Vehicle Schedule Successfully Deleted',
    content: `Vehicle Schedule ${name} Successfully Deleted`,
  };
};

module.exports = {
  selectAllVehicleSchedule,
  selectVehicleSchedule,
  validateVehicleScheduleInputs,
  createVehicleSchedule,
  updateVehicleSchedule,
  deleteVehicleSchedule,
  progressVehicleSchedule,
};
