/* eslint-disable no-unused-vars */

'use strict';

const fs = require('fs');
const { Op } = require('sequelize');
const { USR_Role } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const picLocationRoleInstance = await USR_Role.findOne({ where: { name: 'PIC Hotel' } });
    const picLocationRoleFeatures = JSON.parse(
      fs.readFileSync('./seeders/data/usr_rolefeatures_pic_location.json'),
    );
    const responses = picLocationRoleFeatures.map((element) => ({
      roleId: picLocationRoleInstance.id,
      featureId: element.featureId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('USR_RoleFeatures', responses);
  },

  async down(queryInterface, Sequelize) {
    const picLocationRoleInstance = await USR_Role.findOne({ where: { name: 'PIC Hotel' } });
    const picLocationRoleFeatures = JSON.parse(
      fs.readFileSync('./seeders/data/usr_rolefeatures_pic_location.json'),
    );

    const responses = picLocationRoleFeatures.map((element) => element.featureId);
    await queryInterface.bulkDelete(
      'USR_RoleFeatures',
      { roleId: picLocationRoleInstance.id, featureId: { [Op.in]: responses } },
      null,
    );
  },
};
