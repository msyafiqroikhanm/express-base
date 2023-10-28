/* eslint-disable no-param-reassign */
const { Op } = require('sequelize');
const {
  TPT_Vendor, TPT_Driver, TPT_Vehicle, TPT_VehicleSchedule, REF_VehicleType, ACM_Location,
  REF_VehicleScheduleStatus, ENV_Event, ENV_TimeEvent, PAR_Contingent, PAR_Participant, PAR_Group,
  REF_EventCategory, REF_GroupStatus, REF_Region, REF_IdentityType, REF_ParticipantType, QRM_QR,
} = require('../models');

const generateTransportationReport = async (limitation = {}) => {
  const transportationReports = await TPT_Vendor.findAll({
    attributes: ['name', 'phoneNbr', 'email', 'address'],
    where: limitation?.picId ? { picId: limitation.picId } : null,
    include: [
      {
        model: TPT_Driver,
        attributes: ['name', 'phoneNbr', 'email'],
        as: 'drivers',
        include: {
          model: TPT_VehicleSchedule,
          attributes: ['id', 'name', 'pickUpTime', 'dropOffTime'],
          as: 'schedules',
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
        },
      },
      {
        model: TPT_Vehicle,
        attributes: ['name', 'vehicleNo', 'vehiclePlateNo'],
        as: 'vehicles',
        include: [
          { model: REF_VehicleType, attributes: ['name'], as: 'type' },
          {
            model: TPT_VehicleSchedule,
            attributes: ['id', 'name', 'pickUpTime', 'dropOffTime', 'pickUpOtherLocation', 'dropOffOtherLocation'],
            as: 'schedules',
            include: [
              {
                model: TPT_Vehicle,
                attributes: ['name'],
                as: 'vehicle',
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
            ],
          },
        ],
      },
    ],
  });

  transportationReports.forEach((vendor) => {
    const schedulesId = new Set([]);
    const schedules = [];

    vendor.vehicles.forEach((vehicle) => {
      vehicle.dataValues.type = vehicle?.type?.dataValues.name || null;
      vehicle.schedules.forEach((schedule) => {
        if (!schedulesId.has(schedule.id)) {
          schedulesId.add(schedule.id);
          delete schedule.dataValues.id;
          schedules.push(schedule);
        }
        schedule.dataValues.driver = schedule?.driver?.dataValues.name || null;
        schedule.dataValues.vehicle = schedule?.vehicle?.dataValues.name || null;
        schedule.dataValues.status = schedule?.status?.dataValues.name || null;
        schedule.dataValues.pickUpLocation = schedule.dataValues.pickUpOtherLocation
          ? schedule.dataValues.pickUpOtherLocation : schedule.pickUp?.dataValues?.name;
        schedule.dataValues.dropOffLocation = schedule.dataValues.dropOffOtherLocation
          ? schedule.dataValues.dropOffOtherLocation : schedule.destination?.dataValues?.name;

        delete schedule.dataValues.pickUpOtherLocation;
        delete schedule.dataValues.dropOffOtherLocation;
        delete schedule.dataValues.pickUp;
        delete schedule.dataValues.destination;
      });
      delete vehicle.dataValues.schedules;
    });

    vendor.drivers.forEach((driver) => {
      driver.dataValues.type = driver?.type?.dataValues.name || null;
      driver.schedules.forEach((schedule) => {
        if (!schedulesId.has(schedule.id)) {
          schedulesId.add(schedule.id);
          delete schedule.dataValues.id;
          schedules.push(schedule);
        }
      });
      delete driver.dataValues.schedules;
    });

    vendor.dataValues.schedules = schedules;
  });
  return {
    success: true,
    message: 'Success Generating Transportation Report',
    content: transportationReports,
  };
};

const generateEventReport = async (limitation = {}) => {
  const events = await ENV_Event.findAll({
    attributes: ['name', 'code', 'minAge', 'maxAge', 'maxParticipantPerGroup', 'maxTotalParticipant'],
    where: limitation?.picId ? { picId: limitation.picId } : null,
    include: [
      { model: REF_EventCategory, attributes: ['name'], as: 'category' },
      {
        model: ACM_Location,
        as: 'location',
        attributes: ['name'],
      },
      { model: ENV_TimeEvent, attributes: ['name', 'start', 'end'], as: 'schedules' },
      {
        model: PAR_Group,
        attributes: ['id', 'name'],
        include: [
          {
            model: REF_GroupStatus,
            attributes: ['name'],
            as: 'status',
          },
          {
            model: PAR_Contingent,
            attributes: ['name'],
            as: 'contingent',
            required: true,
          },
          {
            model: PAR_Participant,
            attributes: ['name'],
            through: {
              attributes: [],
            },
          },
        ],
      },
    ],
  });

  events.forEach((event) => {
    event.dataValues.category = event.category?.dataValues.name || null;
    event.dataValues.location = event.location?.dataValues.name || null;
    event.dataValues.groups = [];

    event.PAR_Groups.forEach((group) => {
      const name = group.dataValues.name || `${group.contingent?.dataValues.name} - ${group.dataValues.id}`;
      event.dataValues.groups.push({
        name,
        contingent: group.contingent?.dataValues.name || null,
        status: group.status?.dataValues.name || null,
        participants: group.PAR_Participants.map((participant) => participant.dataValues.name),
      });
    });

    delete event.dataValues.PAR_Groups;
  });

  return {
    success: true,
    message: 'Success Generating Event Report',
    content: events,
  };
};

const generateParticipantReport = async (limitation = {}) => {
  console.log(limitation);

  const participants = await PAR_Participant.findAll({
    where: { contingentId: { [Op.ne]: null }, committeeTypeId: null },
    order: [['contingentId', 'ASC'], ['name', 'ASC']],
    attributes: ['name', 'gender', 'birthDate', 'identityNo', 'phoneNbr', 'email', 'address'],
    include: [
      {
        model: PAR_Contingent,
        as: 'contingent',
        where: limitation?.contingentId ? { id: limitation.contingentId } : null,
        attributes: ['name'],
        required: true,
        include: { model: REF_Region, as: 'region', attributes: ['name'] },
      },
      { model: QRM_QR, attributes: ['code'], as: 'qr' },
      { model: REF_IdentityType, attributes: ['name'], as: 'identityType' },
      { model: REF_ParticipantType, attributes: ['name'], as: 'participantType' },
      {
        model: PAR_Group,
        as: 'groups',
        attributes: ['id'],
        through: { attributes: [] },
        include: { model: ENV_Event, attributes: ['name'], as: 'event' },
      },
    ],
  });

  participants.forEach((participant) => {
    participant.dataValues.region = participant.contingent?.region?.dataValues.name || null;
    participant.dataValues.contingent = participant.contingent?.dataValues.name || null;
    participant.dataValues.qrCode = participant.qr?.dataValues.code || null;
    participant.dataValues.identityType = participant.identityType?.dataValues.name || null;
    participant.dataValues.participantType = participant.participantType?.dataValues.name || null;
    participant.dataValues.events = participant.groups.map(
      (group) => group?.event?.dataValues.name,
    );

    delete participant.dataValues.groups;
    delete participant.dataValues.qr;
  });

  return {
    success: true,
    message: 'Success Generating Event Report',
    content: participants,
  };
};

module.exports = {
  generateTransportationReport,
  generateEventReport,
  generateParticipantReport,
};
