/* eslint-disable no-unused-vars */

'use strict';

const fs = require('fs');
const { Op } = require('sequelize');
const { USR_Role } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const adminRole = await USR_Role.findOne({ where: { name: 'Admin Transportation' } });
    const adminFeatures = JSON.parse(
      fs.readFileSync('./seeders/data/usr_rolefeatures_admin_transportation.json'),
    );
    const responses = adminFeatures.map((element) => ({
      roleId: adminRole.id,
      featureId: element.featureId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('USR_RoleFeatures', responses);
  },

  async down(queryInterface, Sequelize) {
    const adminRole = await USR_Role.findOne({ where: { name: 'Admin Transportation' } });
    const adminFeatures = JSON.parse(
      fs.readFileSync('./seeders/data/usr_rolefeatures_admin_transportation.json'),
    );

    const responses = adminFeatures.map((element) => element.featureId);
    await queryInterface.bulkDelete(
      'USR_RoleFeatures',
      { roleId: adminRole.id, featureId: { [Op.in]: responses } },
      null,
    );
  },
};
