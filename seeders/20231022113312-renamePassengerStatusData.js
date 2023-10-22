/* eslint-disable no-unused-vars */

'use strict';

const fs = require('fs');
const { Op } = require('sequelize');
const { REF_PassengerStatus } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('REF_PassengerStatuses', null, {
      truncate: true,
      restartIdentity: true,
    });

    //* REF_PassengerStatuses New Status
    const REF_PassengerStatuses = JSON.parse(
      fs.readFileSync('./seeders/data/ref_passengerstatuses_newstatus.json'),
    );
    const passengerStatus = REF_PassengerStatuses.map((element) => ({
      name: element.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('REF_PassengerStatuses', passengerStatus);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('REF_PassengerStatuses', null, {
      truncate: true,
      restartIdentity: true,
    });

    //* REF_PassengerStatuses
    const REF_PassengerStatuses = JSON.parse(
      fs.readFileSync('./seeders/data/ref_passengerstatuses.json'),
    );
    const passengerStatus = REF_PassengerStatuses.map((element) => ({
      name: element.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('REF_PassengerStatuses', passengerStatus);
  },
};
