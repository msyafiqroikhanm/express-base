/* eslint-disable no-unused-vars */

'use strict';

const fs = require('fs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    //* FNB_Couriers
    const fnb_couriers = JSON.parse(fs.readFileSync('./seeders/data/fnb_couriers.json'));
    const responses = fnb_couriers.map((element) => ({
      name: element.name,
      phoneNbr: element.phoneNbr,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('FNB_Couriers', responses);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('FNB_Couriers', null, {
      truncate: true,
      restartIdentity: true,
    });
  },
};
