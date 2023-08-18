/* eslint-disable no-unused-vars */

'use strict';

const fs = require('fs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    //* REF_configurationCategory
    const ref_configurationcategories = JSON.parse(
      fs.readFileSync('./seeders/data/ref_configurationcategories.json'),
    );
    const categories = ref_configurationcategories.map((element) => ({
      name: element.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('REF_configurationCategories', categories);

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
    await queryInterface.bulkDelete('REF_configurationCategories', null, {
      truncate: true,
      restartIdentity: true,
    });

    await queryInterface.bulkDelete('SYS_Configurations', null, {
      truncate: true,
      restartIdentity: true,
    });
  },
};
