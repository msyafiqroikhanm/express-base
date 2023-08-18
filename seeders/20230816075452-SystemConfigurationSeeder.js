/* eslint-disable no-unused-vars */

'use strict';

const fs = require('fs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    //* SYS_Configuration
    const systemConfigurations = JSON.parse(
      fs.readFileSync('./seeders/data/sys_configurations.json'),
    );
    const configurations = systemConfigurations.map((element) => ({
      categoryId: element.categoryId,
      name: element.name,
      value: element.value,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('SYS_Configurations', configurations);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('SYS_Configurations', null, {
      truncate: true,
      restartIdentity: true,
    });
  },
};
