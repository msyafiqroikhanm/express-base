/* eslint-disable no-unused-vars */

'use strict';

const fs = require('fs');
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    //* ACM_Locations
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

    //* ACM_Facilities
    const acm_facilities = JSON.parse(
      fs.readFileSync('./seeders/data/acm_facilities.json'),
    );
    const facilities = acm_facilities.map((element) => ({
      locationId: element.locationId,
      name: element.name,
      quantity: element.quantity,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('ACM_Facilities', facilities);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ACM_Locations', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('ACM_Facilities', null, {
      truncate: true,
      restartIdentity: true,
    });
  },
};
