/* eslint-disable no-unused-vars */

'use strict';

const fs = require('fs');
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    //* ACM_Location
    const acm_locations = JSON.parse(
      fs.readFileSync('./seeders/data/acm_locations.json'),
    );
    const locations = acm_locations.map((element) => ({
      parentLocationId: element.parentLocationId,
      picId: element.picId,
      picItId: element.picItId,
      typeId: element.typeId,
      name: element.name,
      description: element.description,
      address: element.address,
      phoneNbr: element.phoneNbr,
      latitude: element.latitude,
      longtitude: element.longtitude,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('ACM_Locations', locations);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ACM_Locations', null, {
      truncate: true,
      restartIdentity: true,
    });
  },
};
