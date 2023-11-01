/* eslint-disable no-param-reassign */
const { Op } = require('sequelize');
const {
  TPT_Vendor, TPT_Driver, TPT_Vehicle, TPT_VehicleSchedule, REF_VehicleType, ACM_Location,
  REF_VehicleScheduleStatus, ENV_Event, ENV_TimeEvent, PAR_Contingent, PAR_Participant, PAR_Group,
  REF_EventCategory, REF_GroupStatus, REF_Region, REF_IdentityType, REF_ParticipantType, QRM_QR,
  ACM_Facility, ACM_Room, REF_RoomType, ACM_RoomBedType, ACM_ParticipantLodger, REF_LodgerStatus,
  FNB_Kitchen, FNB_KitchenTarget, FNB_Menu, FNB_Schedule, FNB_Courier, FNB_ScheduleMenu,
  REF_MenuType, REF_FoodType, REF_FoodScheduleStatus,

} = require('../models');

const generateTransportationReport = async (limitation = {}) => {
  // const transportationReports = await TPT_Vendor.findAll({
  //   attributes: ['name', 'phoneNbr', 'email', 'address'],
  //   where: limitation?.picId ? { picId: limitation.picId } : null,
  //   include: [
  //     {
  //       model: TPT_Driver,
  //       attributes: ['name', 'phoneNbr', 'email'],
  //       as: 'drivers',
  //       include: {
  //         model: TPT_VehicleSchedule,
  //         attributes: ['id', 'name', 'pickUpTime', 'dropOffTime'],
  //         as: 'schedules',
  //         include: [
  //           {
  //             model: TPT_Vehicle,
  //             attributes: ['name', 'vendorId'],
  //             as: 'vehicle',
  //             required: false,
  //           },
  //           {
  //             model: TPT_Driver,
  //             attributes: ['name', 'vendorId'],
  //             as: 'driver',
  //             required: false,
  //           },
  //           { model: REF_VehicleScheduleStatus, attributes: ['name'], as: 'status' },
  //           {
  //             model: ACM_Location,
  //             attributes: ['id', 'name', 'address'],
  //             as: 'pickUp',
  //           },
  //           {
  //             model: ACM_Location,
  //             attributes: ['id', 'name', 'address'],
  //             as: 'destination',
  //           },
  //         ],
  //       },
  //     },
  //     {
  //       model: TPT_Vehicle,
  //       attributes: ['name', 'vehicleNo', 'vehiclePlateNo'],
  //       as: 'vehicles',
  //       include: [
  //         { model: REF_VehicleType, attributes: ['name'], as: 'type' },
  //         {
  //           model: TPT_VehicleSchedule,
  //           attributes: [
  //        'id', 'name', 'pickUpTime', 'dropOffTime', 'pickUpOtherLocation', 'dropOffOtherLocation'
  //       ],
  //           as: 'schedules',
  //           include: [
  //             {
  //               model: TPT_Vehicle,
  //               attributes: ['name'],
  //               as: 'vehicle',
  //               required: false,
  //             },
  //             {
  //               model: TPT_Driver,
  //               attributes: ['name'],
  //               as: 'driver',
  //               required: false,
  //             },
  //             { model: REF_VehicleScheduleStatus, attributes: ['name'], as: 'status' },
  //             {
  //               model: ACM_Location,
  //               attributes: ['id', 'name', 'address'],
  //               as: 'pickUp',
  //             },
  //             {
  //               model: ACM_Location,
  //               attributes: ['id', 'name', 'address'],
  //               as: 'destination',
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // });

  // transportationReports.forEach((vendor) => {
  //   const schedulesId = new Set([]);
  //   const schedules = [];

  //   vendor.vehicles.forEach((vehicle) => {
  //     vehicle.dataValues.type = vehicle?.type?.dataValues.name || null;
  //     vehicle.schedules.forEach((schedule) => {
  //       if (!schedulesId.has(schedule.id)) {
  //         schedulesId.add(schedule.id);
  //         delete schedule.dataValues.id;
  //         schedules.push(schedule);
  //       }
  //       schedule.dataValues.driver = schedule?.driver?.dataValues.name || null;
  //       schedule.dataValues.vehicle = schedule?.vehicle?.dataValues.name || null;
  //       schedule.dataValues.status = schedule?.status?.dataValues.name || null;
  //       schedule.dataValues.pickUpLocation = schedule.dataValues.pickUpOtherLocation
  //         ? schedule.dataValues.pickUpOtherLocation : schedule.pickUp?.dataValues?.name;
  //       schedule.dataValues.dropOffLocation = schedule.dataValues.dropOffOtherLocation
  //         ? schedule.dataValues.dropOffOtherLocation : schedule.destination?.dataValues?.name;

  //       delete schedule.dataValues.pickUpOtherLocation;
  //       delete schedule.dataValues.dropOffOtherLocation;
  //       delete schedule.dataValues.pickUp;
  //       delete schedule.dataValues.destination;
  //     });
  //     delete vehicle.dataValues.schedules;
  //   });

  //   vendor.drivers.forEach((driver) => {
  //     driver.dataValues.type = driver?.type?.dataValues.name || null;
  //     driver.schedules.forEach((schedule) => {
  //       if (!schedulesId.has(schedule.id)) {
  //         schedulesId.add(schedule.id);
  //         delete schedule.dataValues.id;
  //         schedules.push(schedule);
  //       }
  //     });
  //     delete driver.dataValues.schedules;
  //   });

  //   vendor.dataValues.schedules = schedules;
  // });

  const transportationReports = await TPT_VehicleSchedule.findAll({
    attributes: ['name', 'pickUpTime', 'dropOffTime', 'totalPassengers', 'dropOffOtherLocation', 'pickUpOtherLocation'],
    include: [
      {
        model: TPT_Vehicle,
        attributes: ['name', 'capacity'],
        as: 'vehicle',
        required: true,
        include: { model: REF_VehicleType, attributes: ['name'], as: 'type' },
      },
      {
        model: TPT_Driver,
        attributes: ['name', 'phoneNbr', 'email'],
        as: 'driver',
        required: true,
        include: {
          model: TPT_Vendor,
          attributes: ['name', 'phoneNbr', 'email', 'address'],
          as: 'vendor',
          where: limitation?.picId ? { picId: limitation.picId } : null,
        },
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

  transportationReports.forEach((schedule) => {
    schedule.dataValues.totalPassengers = schedule.dataValues.totalPassengers || 0;

    schedule.dataValues.vendor = schedule?.driver?.vendor?.dataValues.name || null;
    schedule.dataValues.vendorPhoneNbr = schedule?.driver?.vendor?.dataValues.phoneNbr || null;
    schedule.dataValues.vendorEmail = schedule?.driver?.vendor?.dataValues.email || null;
    schedule.dataValues.vendorAddress = schedule?.driver?.vendor?.dataValues.address || null;

    schedule.dataValues.vehicle = schedule?.vehicle?.dataValues.name || null;
    schedule.dataValues.vehicleType = schedule?.vehicle?.type?.dataValues.name || null;

    schedule.dataValues.driver = schedule?.driver?.dataValues.name || null;
    schedule.dataValues.driverPhoneNbr = schedule?.driver?.dataValues.phoneNbr || null;
    schedule.dataValues.driverEmail = schedule?.driver?.dataValues.email || null;

    schedule.dataValues.pickUp = schedule.dataValues.pickUpOtherLocation
      || schedule.pickUp?.dataValues.name;
    schedule.dataValues.destination = schedule.dataValues.dropOffOtherLocation
      || schedule.destination?.dataValues.name;

    schedule.dataValues.status = schedule?.status?.dataValues.name || null;

    delete schedule.dataValues.dropOffOtherLocation;
    delete schedule.dataValues.pickUpOtherLocation;
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
    message: 'Success Generating Participant Report',
    content: participants,
  };
};

const generateAccomodationReport = async (limitation = {}) => {
  const accomodations = await ACM_Location.findAll({
    where: limitation?.picId ? { picId: limitation.picId, typeId: 2 } : { typeId: 2 },
    attributes: ['name', 'address', 'phoneNbr', 'address', 'latitude', 'longtitude', 'description'],
    include: [
      {
        model: ACM_Location,
        as: 'childLocation',
      },
      {
        model: ACM_Facility,
        as: 'facilities',
        attributes: ['name', 'quantity'],
      },
      {
        model: ACM_Room,
        as: 'rooms',
        attributes: ['name', 'floor', 'capacity'],
        include: [
          {
            model: REF_RoomType,
            as: 'type',
            attributes: ['name'],
          },
          {
            model: ACM_RoomBedType,
            as: 'bed',
            attributes: ['name'],
          },
          {
            model: ACM_ParticipantLodger,
            as: 'lodger',
            attributes: ['reservationIn', 'reservationOut', 'checkIn', 'checkout'],
            include: [
              { model: PAR_Participant, attributes: ['name'], as: 'participant' },
              { model: REF_LodgerStatus, attributes: ['name'], as: 'status' },
            ],
          },
        ],
      },
    ],
  });

  accomodations.forEach((hotel) => {
    hotel.dataValues.lodgers = [];
    hotel.rooms.forEach((room) => {
      room.dataValues.type = room?.type?.dataValues.name || null;
      room.dataValues.bed = room?.bed?.dataValues.name || null;
      room.lodger.forEach((lodger) => {
        lodger.dataValues.participant = lodger?.participant?.dataValues.name || null;
        lodger.dataValues.status = lodger?.status?.dataValues.name || null;
        lodger.dataValues.room = room.dataValues.name;
        hotel.dataValues.lodgers.push(lodger);
      });

      delete room.dataValues.lodger;
    });
  });

  return {
    success: true,
    message: 'Success Generating Accomodation Report',
    content: accomodations,
  };
};

const generateFNBReport = async (limitation = {}) => {
  const fnb = await FNB_Kitchen.findAll({
    where: limitation?.picId ? { picId: limitation.picId } : null,
    attributes: ['name', 'phoneNbr', 'address'],
    include: [
      {
        model: FNB_KitchenTarget,
        attributes: ['date', 'quantityTarget', 'quantityActual'],
        include: {
          model: FNB_Menu,
          attributes: ['name'],
          as: 'menu',
          include: [
            { model: REF_MenuType, attributes: ['name'], as: 'menuType' },
            { model: REF_FoodType, attributes: ['name'], as: 'foodType' },
          ],
        },
      },
      {
        model: FNB_Schedule,
        attributes: ['name', 'pickUpTime', 'dropOfTime', 'vehiclePlateNo'],
        include: [
          { model: REF_FoodScheduleStatus, attributes: ['name'], as: 'status' },
          { model: FNB_Courier, attributes: ['name'], as: 'courier' },
          {
            model: FNB_ScheduleMenu,
            attributes: ['quantity'],
            as: 'items',
            include: {
              model: FNB_KitchenTarget,
              attributes: ['id'],
              as: 'kitchenTarget',
              include: { model: FNB_Menu, attributes: ['name'], as: 'menu' },
            },
          },
        ],
      },
    ],
  });

  fnb.forEach((kitchen) => {
    kitchen.dataValues.productions = [];
    kitchen.dataValues.deliveries = [];

    kitchen.FNB_KitchenTargets.forEach((production) => {
      production.dataValues.food = production?.menu?.dataValues.name || null;
      production.dataValues.target = production?.menu?.foodType?.dataValues.name || null;
      production.dataValues.type = production?.menu?.menuType?.dataValues.name || null;

      delete production.dataValues.menu;
      kitchen.dataValues.productions.push(production);
    });

    kitchen.FNB_Schedules.forEach((delivery) => {
      delivery.dataValues.status = delivery?.status?.dataValues.name || null;
      delivery.dataValues.courier = delivery?.courier?.dataValues.name || null;

      delivery.items.forEach((item) => {
        item.dataValues.food = item?.kitchenTarget?.menu?.dataValues.name || null;

        delete item.dataValues.kitchenTarget;
      });

      kitchen.dataValues.deliveries.push(delivery);
    });

    delete kitchen.dataValues.FNB_KitchenTargets;
    delete kitchen.dataValues.FNB_Schedules;
  });

  return {
    success: true,
    message: 'Success Generating FnB Report',
    content: fnb,
  };
};

module.exports = {
  generateTransportationReport,
  generateEventReport,
  generateParticipantReport,
  generateAccomodationReport,
  generateFNBReport,
};
