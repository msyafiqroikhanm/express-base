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
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('FNB_Couriers', responses);

    //* FNB_Kitchen
    const fnb_kitchen = JSON.parse(fs.readFileSync('./seeders/data/fnb_kitchens.json'));
    const kitchens = fnb_kitchen.map((element) => ({
      picId: element.picId,
      name: element.name,
      phoneNbr: element.phoneNbr,
      longtitude: element.longtitude,
      latitude: element.latitude,
      address: element.address,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('FNB_Kitchens', kitchens);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('FNB_Couriers', null, {
      truncate: true,
      restartIdentity: true,
    });
  },
};
