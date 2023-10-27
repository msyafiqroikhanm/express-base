/* eslint-disable no-param-reassign */
const { fn, col, Op } = require('sequelize');
const {
  PAR_Participant, REF_Region, PAR_Contingent, ENV_Event, PAR_Group, TPT_Vehicle,
  TPT_Driver, TPT_Vendor, TPT_VehicleSchedule, REF_VehicleScheduleStatus, ACM_Location,
  REF_EventCategory, REF_GroupStatus, REF_VehicleType, CSM_Broadcast, REF_TemplateCategory,
  CSM_BroadcastTemplate, REF_LocationType, ACM_Room, ACM_ParticipantLodger, FNB_Kitchen, FNB_Menu,
  FNB_Courier, FNB_KitchenTarget, FNB_Feedback,
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
  const vehiclePerTypes = await REF_VehicleType.findAll({
    attributes: ['name'],
    include: {
      model: TPT_Vehicle,
      attributes: ['id'],
      as: 'vehicles',
      where: { deletedAt: null },
      required: false,
    },
  });
  vehiclePerTypes.forEach((type) => {
    type.dataValues.total = type.vehicles?.length || 0;
    delete type.dataValues.vehicles;
  });
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
    attributes: ['name', 'pickUpTime', 'dropOffTime', 'descriptionPickUp', 'descriptionDropOff'],
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
      vehiclePerTypes,
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

const eventDashboard = async (limitation = {}) => {
  const totalEvent = await ENV_Event.count();
  const events = await REF_EventCategory.findAll({
    attributes: ['name'],
    include: {
      model: ENV_Event,
      attributes: ['name', 'code'],
      as: 'events',
      where: limitation?.events.length ? { id: { [Op.in]: limitation.events } } : null,
      include: [
        {
          model: ACM_Location, attributes: ['name'], as: 'location', required: true,
        },
        {
          model: PAR_Group,
          attributes: ['contingentId'],
          include: [
            {
              model: PAR_Contingent, attributes: ['name'], as: 'contingent', required: true,
            },
            {
              model: PAR_Participant,
              attributes: ['id'],
              // required: true,
              through: {
                attributes: [],
              },
            },
            {
              model: REF_GroupStatus, attributes: ['name'], as: 'status',
            },
          ],
        },
      ],
    },
  });

  events.forEach((category) => {
    category?.events.forEach((event) => {
      let contingents = [];
      event.dataValues.totalContingent = event.PAR_Groups?.length || 0;
      let totalParticipants = 0;
      if (event.PAR_Groups?.length > 0) {
        contingents = event.PAR_Groups.map((contingent) => {
          totalParticipants += contingent.PAR_Participants?.length || 0;
          return {
            name: contingent.contingent.name,
            participants: contingent.PAR_Participants.length,
            status: contingent.status?.dataValues.name || null,
          };
        });
      }

      event.dataValues.totalParticipants = totalParticipants;
      event.dataValues.contingents = contingents;
      event.dataValues.location = event.location.dataValues.name;
      delete event.dataValues.PAR_Groups;
    });
  });

  return {
    totalEvent,
    events,
  };
};

const customerServiceDashboard = async () => {
  const totalBroadcast = await CSM_Broadcast.count();

  const broadcastByType = await REF_TemplateCategory.findAll({
    attributes: ['name'],
    include: {
      model: CSM_BroadcastTemplate,
      attributes: ['id'],
      as: 'templates',
      include: { model: CSM_Broadcast, attributes: ['id'], as: 'broadcasts' },
    },
  });
  broadcastByType.forEach((type) => {
    let totalBroadcasts = 0;
    if (type.templates?.length) {
      type.templates.forEach((template) => {
        totalBroadcasts += template.broadcasts?.length || 0;
      });
    }
    type.dataValues.totalBroadcast = totalBroadcasts;
    delete type.dataValues.templates;
  });

  const broadcastByStatus = await CSM_Broadcast.findAll({
    attributes: [
      'status',
      [fn('count', col('id')), 'total'],
    ],
    group: ['status'],
  });

  return {
    totalBroadcast,
    broadcastByType,
    broadcastByStatus,
  };
};

const accomodationDashboard = async (limitation = {}) => {
  // Location
  const totalLocation = await ACM_Location.count();
  const locationByType = await REF_LocationType.findAll({
    attributes: ['name'],
    include: { model: ACM_Location, attributes: ['id'] },
  });
  locationByType.forEach((type) => {
    type.dataValues.total = type.ACM_Locations?.length || 0;
    delete type.dataValues.ACM_Locations;
  });

  // Room
  const totalRoom = await ACM_Room.count();
  const totalAvailableRoom = await ACM_Room.count({ where: { statusId: 1 } });

  // general infomartion per hotel
  const perHotelInformation = await ACM_Location.findAll({
    attributes: ['name'],
    where: limitation?.locations?.length
      ? { id: { [Op.in]: limitation.locations }, typeId: 2 } : { typeId: 2 },
    include: {
      model: ACM_Room,
      attributes: ['id', 'statusId'],
      as: 'rooms',
      include: { model: ACM_ParticipantLodger, attributes: ['id'], as: 'lodger' },
    },
  });

  perHotelInformation.forEach((hotel) => {
    hotel.dataValues.total = hotel.rooms?.length || 0;
    let totalAvailableRooms = 0;
    let totalLodgers = 0;
    hotel.rooms.forEach((room) => {
      if (room.statusId === 1) {
        totalAvailableRooms += 1;
      }
      totalLodgers += room.lodger?.length || 0;
    });
    hotel.dataValues.totalAvailableRoom = totalAvailableRooms;
    hotel.dataValues.totalOccupiedRoom = hotel.rooms?.length || 0 - totalAvailableRooms;
    hotel.dataValues.totalLodger = totalLodgers;
    delete hotel.dataValues.rooms;
  });
  return {
    totalLocation,
    locationByType,
    totalRoom,
    totalAvailableRoom,
    totalOccupiedRoom: totalRoom - totalAvailableRoom,
    perHotelInformation,
  };
};

const fnbDashboard = async (limitation = {}) => {
  // Kitchen
  const totalKitchen = await FNB_Kitchen.count();
  const todayKitchenData = await FNB_Kitchen.findAll({
    where: limitation?.kitchens?.length ? { id: { [Op.in]: limitation.kitchens } } : null,
    attributes: ['name'],
    include: {
      model: FNB_KitchenTarget,
      attributes: ['quantityTarget', 'quantityActual'],
      where: {
        date: {
          [Op.gte]: new Date().setHours(0, 0, 0, 0),
          [Op.lte]: new Date().setHours(23, 59, 59, 999),
        },
      },
      required: false,
      include: {
        model: FNB_Menu,
        attributes: ['name'],
        as: 'menu',
        required: false,
      },
    },
  });
  todayKitchenData?.forEach((kitchen) => {
    kitchen?.FNB_KitchenTargets.forEach((target) => {
      target.dataValues.quantityActual = target.dataValues.quantityActual || 0;
      target.dataValues.menu = target.menu.dataValues.name;
    });

    kitchen.dataValues.targets = kitchen.FNB_KitchenTargets;
    delete kitchen.dataValues.FNB_KitchenTargets;
  });

  // Menu
  const todayMenu = await FNB_Menu.findAll({
    where: {
      date: {
        [Op.gte]: new Date().setHours(0, 0, 0, 0),
        [Op.lte]: new Date().setHours(23, 59, 59, 999),
      },
    },
    attributes: ['name', 'quantity'],
    include: { model: FNB_KitchenTarget, attributes: ['quantityActual'] },
  });
  todayMenu.forEach((menu) => {
    menu.dataValues.targetQuantity = menu.dataValues.quantity || 0;
    let produceQuantity = 0;
    menu.FNB_KitchenTargets.forEach((target) => {
      produceQuantity += target.dataValues.quantityActual || 0;
    });
    menu.dataValues.produceQuantity = produceQuantity;
    delete menu.dataValues.quantity;
    delete menu.dataValues.FNB_KitchenTargets;
  });

  // Courier
  const totalCourier = await FNB_Courier.count();
  const totalAvailableCourier = await FNB_Courier.count({ where: { isAvailable: true } });

  // feedback
  const totalFeedback = await FNB_Feedback.count();
  const feedbacks = await FNB_Feedback.findAll({
    attributes: [
      [fn('avg', col('deliciousness')), 'averageDeliciousness'],
      [fn('avg', col('combination')), 'averageCombination'],
      [fn('avg', col('suitability')), 'averageSuitability'],
      [fn('avg', col('arrangement')), 'averageArrangement'],
      [fn('avg', col('appearance')), 'averageAppearance'],
      [fn('avg', col('cleanliness')), 'averageCleanliness'],
      [fn('avg', col('aroma')), 'averageAroma'],
      [fn('avg', col('freshness')), 'averageFreshness'],
    ],
  });

  return {
    totalKitchen,
    todayKitchenData,
    todayMenu,
    totalCourier,
    totalAvailableCourier,
    totalFeedback,
    feedbacks,
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
  if (modules.includes('Event Management')) {
    const event = await eventDashboard(limitation?.event || null);
    dashboard.push({ event });
  }
  if (modules.includes('Customer Service Management')) {
    const customerService = await customerServiceDashboard();
    dashboard.push({ customerService });
  }
  if (modules.includes('Accomodation Management')) {
    const accomodation = await accomodationDashboard(limitation?.accomodation || null);
    dashboard.push({ accomodation });
  }
  if (modules.includes('FnB Management')) {
    const fnb = await fnbDashboard(limitation?.fnb || null);
    dashboard.push({ fnb });
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
