/* eslint-disable no-unused-vars */

('use strict');

const fs = require('fs');
const { USR_Role } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const courierRoleInstance = await USR_Role.findOne({ where: { name: 'Courier' } });
    if (!courierRoleInstance) {
      await queryInterface.bulkInsert('USR_Roles', [
        {
          templateId: 1,
          name: 'Courier',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    } else {
      const courierRoleFeatures = JSON.parse(
        fs.readFileSync('./seeders/data/usr_rolefeatures_courier.json'),
      );
      const responses = courierRoleFeatures.map((element) => ({
        roleId: courierRoleInstance.id,
        featureId: element.featureId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      await queryInterface.bulkInsert('USR_RoleFeatures', responses);
    }
  },

  async down(queryInterface, Sequelize) {
    const courierRoleInstance = await USR_Role.findOne({ where: { name: 'Courier' } });
    await queryInterface.bulkDelete('USR_Roles', { name: 'Courier' }, null);
    await queryInterface.bulkDelete('USR_RoleFeatures', { roleId: courierRoleInstance.id }, null);
  },
};
