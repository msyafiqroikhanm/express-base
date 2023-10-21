/* eslint-disable no-unused-vars */

'use strict';

const fs = require('fs');
const { Op } = require('sequelize');
const { REF_VehicleScheduleStatus } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('REF_VehicleScheduleStatuses', null, {
      truncate: true,
      restartIdentity: true,
    });

    //* REF_VehicleScheduleStatuses New Status
    const ref_vehicleschedulestatuses = JSON.parse(
      fs.readFileSync('./seeders/data/ref_vehicleschedulestatuses_newstatus.json'),
    );
    const vehicleschedulestatuses = ref_vehicleschedulestatuses.map((element) => ({
      name: element.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('REF_VehicleScheduleStatuses', vehicleschedulestatuses);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('REF_VehicleScheduleStatuses', null, {
      truncate: true,
      restartIdentity: true,
    });

    //* REF_VehicleScheduleStatuses
    const ref_vehicleschedulestatuses = JSON.parse(
      fs.readFileSync('./seeders/data/ref_vehicleschedulestatuses.json'),
    );
    const vehicleschedulestatuses = ref_vehicleschedulestatuses.map((element) => ({
      name: element.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('REF_VehicleScheduleStatuses', vehicleschedulestatuses);

    await REF_VehicleScheduleStatus.create({ name: 'Scheduled' });
  },
};
