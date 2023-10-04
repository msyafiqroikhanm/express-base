/* eslint-disable no-unused-vars */

'use strict';

const fs = require('fs');
const { Op } = require('sequelize');
const { USR_Role } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const picKitchenRoleInstance = await USR_Role.findOne({ where: { name: 'PIC Kitchen' } });
    const picKitchenRoleFeatures = JSON.parse(
      fs.readFileSync('./seeders/data/usr_rolefeatures_pic_kitchen.json'),
    );
    const responses = picKitchenRoleFeatures.map((element) => ({
      roleId: picKitchenRoleInstance.id,
      featureId: element.featureId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('USR_RoleFeatures', responses);
  },

  async down(queryInterface, Sequelize) {
    const picKitchenRoleInstance = await USR_Role.findOne({ where: { name: 'PIC Kitchen' } });
    const picKitchenRoleFeatures = JSON.parse(
      fs.readFileSync('./seeders/data/usr_rolefeatures_pic_kitchen.json'),
    );

    const responses = picKitchenRoleFeatures.map((element) => element.featureId);
    await queryInterface.bulkDelete(
      'USR_RoleFeatures',
      { roleId: picKitchenRoleInstance.id, featureId: { [Op.in]: responses } },
      null,
    );
  },
};
