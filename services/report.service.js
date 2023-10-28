/* eslint-disable no-param-reassign */
const {
  TPT_Vendor, TPT_Driver, TPT_Vehicle, TPT_VehicleSchedule, REF_VehicleType, ACM_Location,
  REF_VehicleScheduleStatus,
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
      vehicle.dataValues.type = vehicle?.type?.dataValues.name;
      vehicle.schedules.forEach((schedule) => {
        if (!schedulesId.has(schedule.id)) {
          schedulesId.add(schedule.id);
          delete schedule.dataValues.id;
          schedules.push(schedule);
        }
        schedule.dataValues.driver = schedule?.driver?.dataValues.name;
        schedule.dataValues.vehicle = schedule?.vehicle?.dataValues.name;
        schedule.dataValues.status = schedule?.status?.dataValues.name;
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
      driver.dataValues.type = driver?.type?.dataValues.name;
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

module.exports = {
  generateTransportationReport,
};
