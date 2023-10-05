/* eslint-disable no-unused-vars */

'use strict';

const fs = require('fs');
const { Op } = require('sequelize');
const { SYS_Configuration } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const newConfigs = JSON.parse(
      fs.readFileSync('./seeders/data/ref_configurationcategories_telegram.json'),
    );
    const responses = newConfigs.map((element) => ({
      name: element.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('REF_ConfigurationCategories', responses);
  },

  async down(queryInterface, Sequelize) {
    const newConfigs = JSON.parse(
      fs.readFileSync('./seeders/data/ref_configurationcategories_telegram.json'),
    );

    const responses = newConfigs.map((element) => element.name);
    await queryInterface.bulkDelete(
      'REF_ConfigurationCategories',
      { name: { [Op.in]: responses } },
      null,
    );
  },
};
