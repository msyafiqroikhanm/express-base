/* eslint-disable no-unused-vars */

'use strict';

const fs = require('fs');
const { Op } = require('sequelize');
const { REF_FoodScheduleStatus } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('REF_FoodScheduleStatuses', null, {
      truncate: true,
      restartIdentity: true,
    });

    //* REF_FoodScheduleStatuses New Status
    const ref_foodschedulestatuses = JSON.parse(
      fs.readFileSync('./seeders/data/ref_foodschedulestatuses _newstatus.json'),
    );
    const foodschedulestatuses = ref_foodschedulestatuses.map((element) => ({
      name: element.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('REF_FoodScheduleStatuses', foodschedulestatuses);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('REF_FoodScheduleStatuses', null, {
      truncate: true,
      restartIdentity: true,
    });

    //* REF_FoodScheduleStatuses
    const ref_foodschedulestatuses = JSON.parse(
      fs.readFileSync('./seeders/data/ref_foodschedulestatuses.json'),
    );
    const foodchedulestatuses = ref_foodschedulestatuses.map((element) => ({
      name: element.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('REF_FoodScheduleStatuses', foodchedulestatuses);

    // await REF_FoodScheduleStatus.create({ name: 'Scheduled' });
  },
};
