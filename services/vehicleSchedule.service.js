/* eslint-disable no-param-reassign */
const { Op } = require('sequelize');
const {
  TPT_VehicleSchedule, TPT_Vehicle, TPT_Driver, ACM_Location, PAR_Participant,
  REF_VehicleScheduleStatus, REF_PassengerStatus, TPT_SchedulePassenger, PAR_Contingent,
  REF_CommitteeType, REF_ParticipantType,
} = require('../models');

const selectAllVehicleSchedule = async (where = {}) => {
  const schedules = await TPT_VehicleSchedule.findAll({
    where: where.driverId ? { driverId: where.driverId } : null,
    include: [
      {
        model: TPT_Vehicle,
        attributes: ['name'],
        as: 'vehicle',
        where: where.picId ? { vendorId: { [Op.in]: where.vendors } } : null,
      },
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

const selectVehicleSchedule = async (id, where = {}) => {
  const scheduleInstance = await TPT_VehicleSchedule.findOne({
    where: where.driverId ? { id, driverId: where.driverId } : { id },
    include: [
      {
        model: TPT_Vehicle,
        attributes: ['name'],
        as: 'vehicle',
        where: where.vendors ? { id: { [Op.in]: where.vendors } } : null,
      },
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

  const passengerList = passengers.map((passenger) => passenger.participantId);

  scheduleInstance.dataValues.passengers = passengers;
  scheduleInstance.dataValues.passengerList = passengerList;
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

  // check up pick up (location id) validity
  const pickUpInstance = await ACM_Location.findByPk(form.pickUpId);
  if (!pickUpInstance) {
    invalid404.push('Pick Up Location Id Not Found');
  }

  // check destination (location id) validity
  const destinationInstance = await ACM_Location.findByPk(form.destinationId);
  if (!destinationInstance) {
    invalid404.push('Destination Location Id Not Found');
  }

  // check if pick up is the same as destination
  if (form.pickUpId === form.destinationId) {
    invalid400.push('Pick Up Location Can\'t Be Same As Destination Location');
  }

  // check to prevent backdate
  if (new Date().getTime() > new Date(form.pickUpTime).getTime()) {
    invalid400.push('Can\'t Set Pick Up Time In The Past');
  }

  // validate Recipiants / receivers
  const validPassengers = await PAR_Participant.findAll({
    where: {
      id: { [Op.in]: form.passengers },
    },
  });

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
      pickUp: pickUpInstance,
      destination: destinationInstance,
      name: form.name,
      pickUpTime: new Date(form.pickUpTime),
      passengers: validPassengers,
    },
  };
};

const createVehicleSchedule = async (form) => {
  const scheduleInstance = await TPT_VehicleSchedule.create({
    name: form.name,
    statusId: 1,
    pickUpId: form.pickUp?.id,
    destinationId: form.destination?.id,
    pickUpTime: form.pickUpTime,
  });

  await scheduleInstance.addPAR_Participants(form.passengers);

  return {
    success: true,
    message: 'Vehicle Schedule Successfully Created',
    content: scheduleInstance,
  };
};

const updateVehicleSchedule = async (form, id) => {
  const scheduleInstance = await TPT_VehicleSchedule.findOne({ where: { id } });
  if (!scheduleInstance) {
    return {
      success: false,
      code: 404,
      message: ['Vehicle Schedule Data Not Found'],
    };
  }

  scheduleInstance.name = form.name;
  scheduleInstance.pickUpId = form.pickUp?.id;
  scheduleInstance.destinationId = form.destination?.id;
  scheduleInstance.pickUpTime = form.pickUpTime;
  await scheduleInstance.save();

  await scheduleInstance.setPAR_Participants(form.passengers);

  return {
    success: true,
    message: 'Vehicle Schedule Successfully Updated',
    content: scheduleInstance,
  };
};

const progressVehicleSchedule = async (form, id, where = {}) => {
  const scheduleInstance = await TPT_VehicleSchedule.findOne({
    where: where.driverId ? { id, driverId: where.driverId } : { id },
    include: { model: REF_VehicleScheduleStatus, attributes: ['name'], as: 'status' },
  });
  if (!scheduleInstance) {
    return {
      success: false,
      code: 404,
      message: ['Vehicle Schedule Data Not Found'],
    };
  }

  if (where.vendors?.length > 0 && scheduleInstance) {
    const vehicleInstance = await TPT_Vehicle.findOne({
      where: { id: scheduleInstance.vehicleId, vendorId: { [Op.in]: where.vendors } },
    });
    if (!vehicleInstance) {
      return {
        success: false,
        code: 404,
        message: ['Vehicle Schedule Data Not Found'],
      };
    }
  }

  const statusInstance = await REF_VehicleScheduleStatus.findByPk(form.statusId);

  scheduleInstance.statusId = statusInstance?.id || scheduleInstance.statusId;
  await scheduleInstance.save();

  if (['Completed', 'Done', 'Finish', 'Arrived'].includes(statusInstance?.name)) {
    // when a trip is finish change passenger status
    // and set both driver and vehicle became available again
    // and set dropOff Time
    const passengerStatus = await REF_PassengerStatus.findOne({ where: { name: { [Op.like]: '%Arrived%' } } });
    await TPT_SchedulePassenger.update(
      { statusId: passengerStatus.id },
      { where: { vehicleScheduleId: scheduleInstance.id, statusId: 2 } },
    );

    await TPT_Driver.update(
      { isAvailable: true },
      { where: { id: scheduleInstance.driverId } },
    );
    await TPT_Vehicle.update(
      { isAvailable: true },
      { where: { id: scheduleInstance.vehicleId } },
    );

    scheduleInstance.dropOffTime = new Date();
    await scheduleInstance.save();
  } else if (['Enroute', 'On Proggress'].includes(statusInstance?.name)) {
    const passengerStatus = await REF_PassengerStatus.findOne({ where: { name: { [Op.like]: '%Enroute%' } } });
    await TPT_SchedulePassenger.update(
      { statusId: passengerStatus.id },
      { where: { vehicleScheduleId: scheduleInstance.id, statusId: 1 } },
    );
  }

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

const validateProvideScheduleInputs = async (form, id, where) => {
  const invalid400 = [];
  const invalid404 = [];

  // check schedule id
  const scheduleInstance = await TPT_VehicleSchedule.findOne({ where: { id } });
  if (!scheduleInstance) {
    invalid404.push('Vehicle Schedule Data Not Found');
  }

  const vehicleInstance = await TPT_Vehicle.findOne({
    where: where.vendors
      ? { id: form.vehicleId, vendorId: { [Op.in]: where.vendors } } : { id: form.vehicleId },
  });
  if (!vehicleInstance) {
    invalid404.push('Vehicle Data Not Found');
  } else if (scheduleInstance.vehicleId !== vehicleInstance.id && !vehicleInstance.isAvailable) {
    // check when with different vehicle data, is the vehicle available
    invalid400.push('Vehicle Is Not Available');
  }

  const driverInstance = await TPT_Driver.findOne({
    where: where.vendors
      ? { id: form.driverId, vendorId: { [Op.in]: where.vendors } } : { id: form.driverId },
  });
  if (!driverInstance) {
    // check if driver exits
    invalid404.push('Driver Data Not Found');
  } else if (scheduleInstance.driverId !== driverInstance.id && !driverInstance.isAvailable) {
    // check when with different driver data, is the driver available
    invalid400.push('Driver Is Not Available');
  }

  if (driverInstance && vehicleInstance) {
    if (driverInstance.vendorId !== vehicleInstance.vendorId) {
      // check if vehicle and driver have same vendor
      invalid400.push('Vehicle And Driver Belongs To Different Vendor');
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

  return {
    isValid: true,
    form: {
      driver: driverInstance,
      vehicle: vehicleInstance,
    },
  };
};

const vendorProvideTransportationSchedule = async (form, id) => {
  const scheduleInstance = await TPT_VehicleSchedule.findOne({ where: { id } });

  scheduleInstance.driverId = form.driver?.id || scheduleInstance.driverId;
  scheduleInstance.vehicleId = form.vehicle?.id || scheduleInstance.vehicleId;
  await scheduleInstance.save();

  if (form.driver && form.driver?.isAvailable) {
    form.driver.isAvailable = false;
    await form.driver.save();
  }

  if (form.vehicle && form.vehicle?.isAvailable) {
    form.vehicle.isAvailable = false;
    await form.vehicle.save();
  }

  return {
    success: true,
    message: 'Vehicle Schedule\'s Driver And Vehicle Successfully Fulfill By The Vendor',
    content: scheduleInstance,
  };
};

const validatePassengerAbsent = async (form, id, where) => {
  const invalid400 = [];
  const invalid404 = [];

  // check schedule id
  const scheduleInstance = await TPT_VehicleSchedule.findOne({
    where: where.driverId ? { id, driverId: where.driverId } : { id },
  });
  if (!scheduleInstance) {
    invalid404.push('Vehicle Schedule Data Not Found');
  }

  if (where.vendors?.length > 0 && scheduleInstance) {
    const vehicleInstance = await TPT_Vehicle.findOne({
      where: { id: scheduleInstance.vehicleId, vendorId: { [Op.in]: where.vendors } },
    });
    if (!vehicleInstance) {
      invalid404.push('Vehicle Schedule Data Not Found');
    }
  }

  // validate Recipiants / receivers
  const validPassengers = await TPT_SchedulePassenger.findAll({
    where: {
      participantId: { [Op.in]: form.passengers },
      vehicleScheduleId: id,
    },
  });

  const statusInstance = await REF_PassengerStatus.findByPk(form.statusId);
  if (!statusInstance) {
    invalid404.push('Status Data Not Found');
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
      schedule: scheduleInstance,
      passengers: validPassengers.map((passenger) => passenger.participantId),
      status: statusInstance,
    },
  };
};

const udpatePassengerAbsent = async (form) => {
  await TPT_SchedulePassenger.update(
    { statusId: form.status.id },
    { where: { vehicleScheduleId: form.schedule.id, participantId: { [Op.in]: form.passengers } } },
  );

  return {
    success: true,
    message: `Passenger's Status On Schedule ${form.schedule.name} Successfully Updated / Reported`,
  };
};

const selectAllPassengersVehicleSchedule = async (id, where = {}) => {
  const scheduleInstance = await TPT_VehicleSchedule.findOne({
    where: where.driverId ? { id, driverId: where.driverId } : { id },
    include: {
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
  });
  if (!scheduleInstance) {
    return {
      success: false,
      code: 404,
      message: ['Vehicle Schedule Data Not Found'],
    };
  }

  if (where.vendors?.length > 0 && scheduleInstance) {
    const vehicleInstance = await TPT_Vehicle.findOne({
      where: { id: scheduleInstance.vehicleId, vendorId: { [Op.in]: where.vendors } },
    });
    if (!vehicleInstance) {
      return {
        success: false,
        code: 404,
        message: ['Vehicle Schedule Data Not Found'],
      };
    }
  }

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

  const passengerList = passengers.map((passenger) => passenger.participantId);

  return {
    success: true,
    message: 'Successfully Getting All Passenger Of Related Schedule',
    content: { passengers, passengerList },
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
  vendorProvideTransportationSchedule,
  udpatePassengerAbsent,
  validateProvideScheduleInputs,
  validatePassengerAbsent,
  selectAllPassengersVehicleSchedule,
};
