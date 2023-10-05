/* eslint-disable no-unused-vars */

'use strict';

const fs = require('fs');
const { Op } = require('sequelize');
const { SYS_Configuration } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const newConfigs = JSON.parse(
      fs.readFileSync('./seeders/data/sys_configuration_whatsapp_telegram.json'),
    );
    const responses = newConfigs.map((element) => ({
      categoryId: element.categoryId,
      name: element.name,
      value: element.value,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('SYS_Configurations', responses);
  },

  async down(queryInterface, Sequelize) {
    const newConfigs = JSON.parse(
      fs.readFileSync('./seeders/data/sys_configuration_whatsapp_telegram.json'),
    );

    const responses = newConfigs.map((element) => element.name);
    await queryInterface.bulkDelete(
      'SYS_Configurations',
      { name: { [Op.in]: responses } },
      null,
    );
  },
};
