/* eslint-disable no-unused-vars */

'use strict';

const fs = require('fs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    //* TPT_Vendors
    const tpt_vendors = JSON.parse(
      fs.readFileSync('./seeders/data/tpt_vendors.json'),
    );
    const vendors = tpt_vendors.map((element) => ({
      name: element.name,
      address: element.address,
      phoneNbr: element.phoneNbr,
      email: element.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('TPT_Vendors', vendors);

    //* TPT_Vehicles
    const tpt_vehicles = JSON.parse(
      fs.readFileSync('./seeders/data/tpt_vehicles.json'),
    );
    const vehicles = tpt_vehicles.map((element) => ({
      vendorId: element.vendorId,
      typeId: element.typeId,
      qrId: null,
      name: element.name,
      vehicleNo: element.vehicleNo,
      vehiclePlateNo: element.vehiclePlateNo,
      availableQuantity: element.availableQuantity,
      capacity: element.capacity,
      isAvailable: element.isAvailable,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('TPT_Vehicles', vehicles);

    //* TPT_VehicleTrackings
    const tpt_vehciletrackings = JSON.parse(
      fs.readFileSync('./seeders/data/tpt_vehciletrackings.json'),
    );
    const vehciletrackings = tpt_vehciletrackings.map((element) => ({
      vehicleId: element.vehicleId,
      latitude: element.latitude,
      longtitude: element.longtitude,
      accuracy: element.accuracy,
      time: new Date(element.time),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('TPT_VehicleTrackings', vehciletrackings);

    //* TPT_Drivers
    const tpt_drivers = JSON.parse(
      fs.readFileSync('./seeders/data/tpt_drivers.json'),
    );
    const drivers = tpt_drivers.map((element) => ({
      vendorId: element.vendorId,
      name: element.name,
      phoneNbr: element.phoneNbr,
      email: element.email,
      isAvailable: element.isAvailable,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('TPT_Drivers', drivers);

    //* TPT_VehicleSchedules
    const tpt_vehicleschedules = JSON.parse(
      fs.readFileSync('./seeders/data/tpt_vehicleschedules.json'),
    );
    const vehicleschedules = tpt_vehicleschedules.map((element) => ({
      driverId: element.driverId,
      vehicleId: element.vehicleId,
      pickUpId: element.pickUpId,
      destinationId: element.destinationId,
      statusId: element.statusId,
      name: element.name,
      pickUpTime: element.pickUpTime ? new Date(element.pickUpTime) : null,
      dropOffTime: element.dropOffTime ? new Date(element.dropOffTime) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('TPT_VehicleSchedules', vehicleschedules);

    //* TPT_SchedulePassengers
    const tpt_schedulepassengers = JSON.parse(
      fs.readFileSync('./seeders/data/tpt_schedulepassengers.json'),
    );
    const schedulepassengers = tpt_schedulepassengers.map((element) => ({
      vehicleScheduleId: element.vehicleScheduleId,
      participantId: element.participantId,
      statusId: element.statusId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('TPT_SchedulePassengers', schedulepassengers);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('TPT_Vendors', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('TPT_Vehicles', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('TPT_VehicleTrackings', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('TPT_Drivers', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('TPT_VehicleSchedules', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('TPT_SchedulePassengers', null, {
      truncate: true,
      restartIdentity: true,
    });
  },
};
