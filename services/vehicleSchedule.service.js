/* eslint-disable no-param-reassign */
const { Op } = require('sequelize');
const {
  TPT_VehicleSchedule,
  TPT_Vehicle,
  TPT_Driver,
  ACM_Location,
  PAR_Participant,
  REF_VehicleScheduleStatus,
  REF_PassengerStatus,
  TPT_SchedulePassenger,
  PAR_Contingent,
  REF_CommitteeType,
  REF_ParticipantType,
  TPT_VehicleScheduleHistory,
} = require('../models');
const passengerStatuses = require('../libraries/passengerStatuses.lib');

const selectAllVehicleSchedule = async (where = {}) => {
  const query = where.driverId ? { driverId: where.driverId } : {};
  if (where.query && where.query?.toLowerCase() === 'non-event') {
    query.otherLocation = { [Op.ne]: null };
  } else if (where.query && where.query?.toLowerCase() === 'event') {
    query.destinationId = { [Op.ne]: null };
  }

  const schedules = await TPT_VehicleSchedule.findAll({
    order: [
      ['updatedAt', 'DESC'],
      ['pickUpTime', 'DESC'],
    ],
    where: Object.keys(query).length > 0 ? query : null,
    include: [
      {
        model: TPT_Vehicle,
        attributes: ['name', 'vendorId'],
        as: 'vehicle',
        required: false,
      },
      {
        model: TPT_Driver,
        attributes: ['name', 'vendorId'],
        as: 'driver',
        required: false,
      },
      { model: REF_VehicleScheduleStatus, attributes: ['name'], as: 'status' },
      {
        model: ACM_Location,
        attributes: ['id', 'name', 'address'],
        as: 'pickUp',
      },
      {
        model: ACM_Location,
        attributes: ['id', 'name', 'address'],
        as: 'destination',
      },
    ],
  });

  let parsedSchedules = schedules.map((schedule) => {
    if (where.picId) {
      if (
        (schedule.driverId == null && schedule.driverId === null)
        || where?.vendors?.includes(schedule.driver.vendorId)
        || where?.vendors?.includes(schedule.vehicle.vendorId)
      ) {
        schedule.dataValues.vehicle = schedule.vehicle?.dataValues.name || null;
        schedule.dataValues.driver = schedule.driver?.dataValues.name || null;
        schedule.dataValues.status = schedule.status?.dataValues.name || null;
        return schedule;
      }
      return null;
    }
    schedule.dataValues.vehicle = schedule.vehicle?.dataValues.name || null;
    schedule.dataValues.driver = schedule.driver?.dataValues.name || null;
    schedule.dataValues.status = schedule.status?.dataValues.name || null;
    return schedule;
  });

  parsedSchedules = parsedSchedules.filter((schedule) => schedule !== null);

  return {
    success: true,
    message: 'Successfully Getting All Vehicle Schedule',
    content: parsedSchedules,
  };
};

const selectVehicleSchedule = async (id, where = {}) => {
  const scheduleInstance = await TPT_VehicleSchedule.findOne({
    where: where.driverId ? { id, driverId: where.driverId } : { id },
    order: [['histories', 'createdAt', 'DESC']],
    include: [
      {
        model: TPT_Vehicle,
        attributes: ['name'],
        as: 'vehicle',
        where: where.vendors ? { vendorId: { [Op.in]: where.vendors } } : null,
        required: false,
      },
      {
        model: TPT_Driver,
        attributes: ['name'],
        as: 'driver',
        required: false,
      },
      { model: REF_VehicleScheduleStatus, attributes: ['name'], as: 'status' },
      {
        model: ACM_Location,
        attributes: ['id', 'name', 'address'],
        as: 'pickUp',
      },
      {
        model: ACM_Location,
        attributes: ['id', 'name', 'address'],
        as: 'destination',
      },
      {
        model: TPT_VehicleScheduleHistory,
        attributes: { exclude: ['updatedAt'] },
        as: 'histories',
        include: { model: REF_VehicleScheduleStatus, attributes: ['name'], as: 'status' },
      },
      {
        model: TPT_SchedulePassenger,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [
          {
            model: PAR_Participant,
            attributes: ['name', 'contingentId', 'typeId', 'committeeTypeId'],
            required: true,
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

  scheduleInstance.dataValues.vehicle = scheduleInstance.vehicle?.dataValues.name || null;
  scheduleInstance.dataValues.driver = scheduleInstance.driver?.dataValues.name || null;
  scheduleInstance.dataValues.status = scheduleInstance.status?.dataValues.name || null;

  scheduleInstance.histories?.forEach((history) => {
    history.dataValues.status = history.status?.dataValues.name || null;
  });

  const passengers = scheduleInstance.TPT_SchedulePassengers.map((passenger) => ({
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
  }));

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

  const passengers = form.passengers || [];

  // check pickup (location id) validity
  let pickUpInstance = null;
  if (form.pickUpId) {
    pickUpInstance = await ACM_Location.findByPk(form.pickUpId);
    if (!pickUpInstance) {
      invalid404.push('Pick Up Location Id Not Found');
    }
  }

  // check destination (location id) validity
  let destinationInstance = null;
  if (form.destinationId) {
    destinationInstance = await ACM_Location.findByPk(form.destinationId);
    if (!destinationInstance) {
      invalid404.push('Destination Location Id Not Found');
    }
  }

  if (form.pickUpId && form.destinationId) {
    // check if pick up is the same as destination
    if (form.pickUpId === form.destinationId) {
      invalid400.push("Pick Up Location Can't Be Same As Destination Location");
    }
  }

  if (form.pickUpOtherLocation && form.dropOffOtherLocation) {
    if (form.pickUpOtherLocation === form.dropOffOtherLocation) {
      invalid400.push("Pick Up Other Location Can't Be Same As Destination Other Location");
    }
  }

  // check only pickup and destination id for "Other" could fill otherLocation attribute
  if (form.pickUpId && form.pickUpOtherLocation) {
    invalid400.push('Pick Up Other Location Could Only Filled When Pick Up Location is Null');
  }
  if (form.destinationId && form.dropOffOtherLocation) {
    invalid400.push('Drop Off Other Location Could Only Filled When Destination Location is Null');
  }

  // * check to prevent backdate
  // if (new Date().getTime() > new Date(form.pickUpTime).getTime()) {
  //   invalid400.push("Can't Set Pick Up Time In The Past");
  // }

  // validate Recipiants / receivers
  const validPassengers = await PAR_Participant.findAll({
    where: {
      id: { [Op.in]: passengers },
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

  const statusInstance = await REF_VehicleScheduleStatus.findOne({ where: { name: 'Scheduled' } });

  return {
    isValid: true,
    form: {
      type: form.type,
      pickUp: pickUpInstance,
      destination: destinationInstance,
      status: statusInstance,
      name: form.name,
      pickUpTime: new Date(form.pickUpTime),
      descriptionPickUp: form.descriptionPickUp,
      descriptionDropOff: form.descriptionDropOff,
      pickUpOtherLocation: form.pickUpOtherLocation,
      dropOffOtherLocation: form.dropOffOtherLocation,
      passengers: validPassengers,
      totalPassengers: validPassengers?.length
        ? validPassengers.length : Number(form.totalPassengers) || 0,
    },
  };
};

const createVehicleSchedule = async (form) => {
  const scheduleInstance = await TPT_VehicleSchedule.create({
    type: form.type,
    name: form.name,
    statusId: form.status?.id || 1,
    pickUpId: form.pickUp?.id || null,
    destinationId: form.destination?.id || null,
    pickUpOtherLocation: form.pickUpOtherLocation,
    dropOffOtherLocation: form.dropOffOtherLocation,
    pickUpTime: form.pickUpTime,
    descriptionPickUp: form.descriptionPickUp,
    descriptionDropOff: form.descriptionDropOff,
    totalPassengers: form.totalPassengers,
  });

  await scheduleInstance.addPAR_Participants(form.passengers);

  await TPT_VehicleScheduleHistory.create({
    vehicleScheduleId: scheduleInstance.id,
    statusId: form.status?.id || 1,
    note: null,
  });

  return {
    success: true,
    message: 'Vehicle Schedule Successfully Created',
    content: scheduleInstance,
  };
};

const updateVehicleSchedule = async (form, id) => {
  const scheduleInstance = await TPT_VehicleSchedule.findOne({
    where: { id },
  });
  if (!scheduleInstance) {
    return {
      success: false,
      code: 404,
      message: ['Vehicle Schedule Data Not Found'],
    };
  }

  scheduleInstance.type = form.type;
  scheduleInstance.name = form.name;
  scheduleInstance.pickUpId = form.pickUp?.id || null;
  scheduleInstance.destinationId = form.destination?.id || null;
  scheduleInstance.pickUpOtherLocation = form.pickUpOtherLocation || null;
  scheduleInstance.dropOffOtherLocation = form.dropOffOtherLocation || null;
  scheduleInstance.pickUpTime = form.pickUpTime;
  scheduleInstance.descriptionPickUp = form.descriptionPickUp;
  scheduleInstance.descriptionDropOff = form.descriptionDropOff;
  scheduleInstance.totalPassengers = form.totalPassengers;
  await scheduleInstance.save();

  await scheduleInstance.setPAR_Participants(form.passengers);

  return {
    success: true,
    message: 'Vehicle Schedule Successfully Updated',
    content: scheduleInstance,
  };
};

const validateProgressVehicleScheduleInputs = async (form, id, where = {}, isAdmin = false) => {
  const scheduleInstance = await TPT_VehicleSchedule.findOne({
    where: where.driverId ? { id, driverId: where.driverId } : { id },
    include: { model: REF_VehicleScheduleStatus, attributes: ['name'], as: 'status' },
  });

  // check old status is complete or cancelled for user non admin
  if (!isAdmin) {
    const oldStatus = await REF_VehicleScheduleStatus.findOne({
      where: { id: scheduleInstance.statusId },
      attributes: ['name'],
    });

    if (['Completed', 'Cancelled'].includes(oldStatus?.name)) {
      return {
        isValid: false,
        code: 400,
        message: ["Completed / Cancelled Vehicle Schedule Can't Change It Status"],
      };
    }
  }

  if (!scheduleInstance) {
    return {
      isValid: false,
      code: 404,
      message: ['Vehicle Schedule Data Not Found'],
    };
  }
  if (scheduleInstance.driverId === null || scheduleInstance.vehicleId === null) {
    return {
      isValid: false,
      code: 400,
      message: ["Vehicle Schedule Without Driver Or Vehicle, Status Can't Be Progressed"],
    };
  }

  if (where.vendors?.length > 0 && scheduleInstance) {
    const vehicleInstance = await TPT_Vehicle.findOne({
      where: { id: scheduleInstance.vehicleId, vendorId: { [Op.in]: where.vendors } },
    });
    if (!vehicleInstance) {
      return {
        isValid: false,
        code: 404,
        message: ['Vehicle Schedule Data Not Found'],
      };
    }
  }

  const statusInstance = await REF_VehicleScheduleStatus.findByPk(form.statusId);

  if (form.statusId && !statusInstance) {
    return {
      isValid: false,
      code: 404,
      message: ['Vehicle Schedule Status Data Not Found'],
    };
  }

  const oldStatus = scheduleInstance?.status?.dataValues.name || null;
  const newStatus = statusInstance?.name || null;

  const allowedTransitions = {
    Scheduled: ['Scheduled', 'Pick Up Passengers', 'Cancelled'],
    'Pick Up Passengers': ['Pick Up Passengers', 'Enroute', 'Cancelled'],
    Enroute: ['Enroute', 'Completed', 'Cancelled'],
  };

  if (
    oldStatus
    && newStatus
    && allowedTransitions[oldStatus]
    && !allowedTransitions[oldStatus].includes(newStatus)
  ) {
    return {
      isValid: false,
      code: 400,
      message: [
        `Vehicle Schedule With Status ${oldStatus}, could only change to status ${allowedTransitions[oldStatus]}`,
      ],
    };
  }

  if (['Completed', 'Cancelled'].includes(oldStatus) && ['Completed', 'Cancelled'].includes(newStatus)) {
    return {
      isValid: false,
      code: 400,
      message: [`${oldStatus} Transportation Schedule Can't Change It Status To ${newStatus}`],
    };
  }

  // check if newStatus is Canceled and required to have note for cancelation
  if (newStatus === 'Cancelled' && !form.note) {
    return {
      isValid: false,
      code: 400,
      message: ['Vehicle Schedule Status Cancelled Required Note For Cancellation'],
    };
  }

  return {
    isValid: true,
    form: {
      statusId: form.statusId,
      note: form.note,
    },
  };
};

const progressVehicleSchedule = async (form, id, where = {}) => {
  const scheduleInstance = await TPT_VehicleSchedule.findOne({
    where: where.driverId ? { id, driverId: where.driverId } : { id },
    include: { model: REF_VehicleScheduleStatus, attributes: ['name'], as: 'status' },
  });

  const statusInstance = await REF_VehicleScheduleStatus.findByPk(form.statusId);

  const oldStatus = scheduleInstance?.status?.dataValues.name || null;
  const newStatus = statusInstance?.name || null;

  scheduleInstance.statusId = statusInstance?.id || scheduleInstance.statusId;
  await scheduleInstance.save();
  scheduleInstance.status = newStatus || oldStatus;

  // check if schedule old status is compled or cancelled to other status
  if (
    ['Completed', 'Cancelled'].includes(oldStatus)
    && !['Completed', 'Cancelled'].includes(newStatus)
  ) {
    await TPT_Driver.update({ isAvailable: false }, { where: { id: scheduleInstance.driverId } });
    await TPT_Vehicle.update({ isAvailable: false }, { where: { id: scheduleInstance.vehicleId } });
  }

  await TPT_VehicleScheduleHistory.create({
    vehicleScheduleId: scheduleInstance.id,
    statusId: statusInstance?.id || scheduleInstance.statusId,
    note: form.note || null,
  });

  if (['Completed', 'Done', 'Finish', 'Arrived'].includes(statusInstance?.name)) {
    // when a trip is finish change passenger status
    // and set both driver and vehicle became available again
    // and set dropOff Time

    await TPT_Driver.update({ isAvailable: true }, { where: { id: scheduleInstance.driverId } });
    await TPT_Vehicle.update({ isAvailable: true }, { where: { id: scheduleInstance.vehicleId } });

    scheduleInstance.dropOffTime = new Date();
    await scheduleInstance.save();
  } else if (statusInstance?.name === 'Cancelled') {
    await TPT_Driver.update({ isAvailable: true }, { where: { id: scheduleInstance.driverId } });
    await TPT_Vehicle.update({ isAvailable: true }, { where: { id: scheduleInstance.vehicleId } });
  }

  return {
    success: true,
    message: `Vehicle Schedul]e Status Of ${scheduleInstance.name} Successully Updated To ${
      statusInstance?.name || scheduleInstance.status?.name
    }`,
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
      ? { id: form.vehicleId, vendorId: { [Op.in]: where.vendors } }
      : { id: form.vehicleId },
  });
  if (!vehicleInstance) {
    invalid404.push('Vehicle Data Not Found');
  } else if (scheduleInstance?.vehicleId !== vehicleInstance.id && !vehicleInstance.isAvailable) {
    // check when with different vehicle data, is the vehicle available
    invalid400.push('Vehicle Is Not Available');
  } else if (vehicleInstance.capacity < scheduleInstance.totalPassengers) {
    invalid400.push('Please select a larger vehicle: The scheduled passengers exceed the vehicle\'s capacity');
  }

  const driverInstance = await TPT_Driver.findOne({
    where: where.vendors
      ? { id: form.driverId, vendorId: { [Op.in]: where.vendors } }
      : { id: form.driverId },
  });
  if (!driverInstance) {
    // check if driver exits
    invalid404.push('Driver Data Not Found');
  } else if (scheduleInstance?.driverId !== driverInstance.id && !driverInstance.isAvailable) {
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

  const oldDriverId = scheduleInstance.dataValues.driverId;
  const oldVehicleId = scheduleInstance.dataValues.vehicleId;

  scheduleInstance.driverId = form.driver?.id || scheduleInstance.driverId;
  scheduleInstance.vehicleId = form.vehicle?.id || scheduleInstance.vehicleId;
  await scheduleInstance.save();

  if (form.driver && form.driver?.isAvailable) {
    form.driver.isAvailable = false;
    await form.driver.save();

    if (oldDriverId && oldDriverId !== form.driver?.id) {
      await TPT_Driver.update(
        { isAvailable: true },
        { where: { id: oldDriverId } },
      );
    }
  }

  if (form.vehicle && form.vehicle?.isAvailable) {
    form.vehicle.isAvailable = false;
    await form.vehicle.save();

    if (oldVehicleId && oldVehicleId !== form.vehicle?.id) {
      await TPT_Vehicle.update(
        { isAvailable: true },
        { where: { id: oldVehicleId } },
      );
    }
  }

  return {
    success: true,
    message: "Vehicle Schedule's Driver And Vehicle Successfully Fulfill By The Vendor",
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
    order: [[TPT_SchedulePassenger, PAR_Participant, 'name', 'ASC']],
    where: where.driverId ? { id, driverId: where.driverId } : { id },
    include: {
      model: TPT_SchedulePassenger,
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          model: PAR_Participant,
          attributes: ['name', 'contingentId', 'typeId', 'committeeTypeId'],
          required: true,
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

  const passengers = scheduleInstance.TPT_SchedulePassengers.map((passenger) => ({
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
  }));

  const passengerList = passengers.map((passenger) => passenger.participantId);

  return {
    success: true,
    message: 'Successfully Getting All Passenger Of Related Schedule',
    content: { passengers, passengerList },
  };
};

const validatePassengerAttendance = async (form, id, where) => {
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

  const allPassengers = await TPT_SchedulePassenger.findAll({
    where: { vehicleScheduleId: id },
    attributes: ['participantId'],
  });
  const passengers = allPassengers.map((passenger) => passenger.participantId);

  // validate participant / passengers
  const validParticipants = await TPT_SchedulePassenger.findAll({
    where: {
      participantId: { [Op.in]: form.passengers },
      vehicleScheduleId: id,
    },
  });
  const validPassengers = validParticipants.map((participant) => participant.participantId);

  const noShowPassengers = passengers.filter((passenger) => !validPassengers.includes(passenger));

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
      passengers: validPassengers,
      noShowPassengers,
    },
  };
};

const updatePassengersAttendance = async (form) => {
  // updating participant who show up / present
  await TPT_SchedulePassenger.update(
    { statusId: passengerStatuses.Present },
    {
      where: {
        vehicleScheduleId: form.schedule.id,
        participantId: { [Op.in]: form.passengers },
      },
    },
  );

  // updating participant who not show up
  await TPT_SchedulePassenger.update(
    { statusId: passengerStatuses.Absent },
    {
      where: {
        vehicleScheduleId: form.schedule.id,
        participantId: { [Op.in]: form.noShowPassengers },
      },
    },
  );

  return {
    success: true,
    message: `Passenger's Status On Schedule ${form.schedule.name} Successfully Updated / Reported`,
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
  validateProgressVehicleScheduleInputs,
  validatePassengerAttendance,
  updatePassengersAttendance,
};
