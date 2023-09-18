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
    if (process.env.NODE_ENV?.toLowerCase() === 'production') {
      configurations.push({
        categoryId: 1,
        name: 'Base URL',
        value: 'http://172.16.0.13:3050',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else if (process.env.NODE_ENV?.toLowerCase() === 'development') {
      configurations.push({
        categoryId: 1,
        name: 'Base URL',
        value: 'http://172.16.0.11:3550',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else if (process.env.NODE_ENV?.toLowerCase() === 'local') {
      configurations.push({
        categoryId: 1,
        name: 'Base URL',
        value: 'https://c138-112-78-165-92.ngrok-free.app',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    await queryInterface.bulkInsert('SYS_Configurations', configurations);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('SYS_Configurations', null, {
      truncate: true,
      restartIdentity: true,
    });
  },
};
