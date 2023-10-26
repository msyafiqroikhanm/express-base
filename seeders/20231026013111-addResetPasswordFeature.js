/* eslint-disable no-unused-vars */

'use strict';

const fs = require('fs');
const { Op } = require('sequelize');
const {
  USR_Feature, USR_RoleFeature, USR_Module, USR_Role,
} = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let resetPassword = await USR_Feature.findOne({ where: { name: 'Reset User Password' } });
    if (!resetPassword) {
      const userModule = await USR_Module.findOne({
        where: { name: 'User Management' },
        attributes: ['id'],
      });
      resetPassword = await USR_Feature.create({ name: 'Reset User Password', moduleId: userModule?.id || 2 });
    }

    const superRole = await USR_Role.findOne({
      where: { name: 'Super User' },
      attributes: ['id'],
    });

    await USR_RoleFeature.create({ featureId: resetPassword.id, roleId: superRole.id || 1 });
  },

  async down(queryInterface, Sequelize) {
    const resetPassword = await USR_Feature.findOne({ where: { name: 'Reset User Password' } });
    if (resetPassword) {
      await USR_RoleFeature.destroy({ where: { featureId: resetPassword.id } });
      await resetPassword.destroy();
    }
  },
};
