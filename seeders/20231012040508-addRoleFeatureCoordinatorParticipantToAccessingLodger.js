/* eslint-disable no-unused-vars */

'use strict';

const { Op } = require('sequelize');
const { USR_Role, USR_RoleFeature, USR_Feature } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const coordinatorRoleInstance = await USR_Role.findOne({
      where: { name: { [Op.substring]: 'participant coordinator' } },
    });

    const lodgerFeature = await USR_Feature.findOne({
      where: { name: 'View Lodger' },
    });

    await USR_RoleFeature.create({
      roleId: coordinatorRoleInstance.id,
      featureId: lodgerFeature.id,
    });
  },

  async down(queryInterface, Sequelize) {
    const coordinatorRoleInstance = await USR_Role.findOne({
      where: { name: { [Op.substring]: 'participant coordinator' } },
    });

    const lodgerFeature = await USR_Feature.findOne({
      where: { name: 'View Lodger' },
    });

    await USR_RoleFeature.destroy({
      where: { roleId: coordinatorRoleInstance.id, featureId: lodgerFeature.id },
    });
  },
};
