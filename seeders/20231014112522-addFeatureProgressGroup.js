/* eslint-disable no-unused-vars */

'use strict';

const fs = require('fs');
const { Op } = require('sequelize');
const { USR_Feature, USR_Role, USR_Module } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const groupModule = await USR_Module.findOne({ where: { name: 'Group' } });
    const newFeature = await USR_Feature.create({ moduleId: groupModule.id, name: 'Progress Group' });
    const roles = await USR_Role.findAll({ where: { name: { [Op.in]: ['Super User', 'Admin Event', 'PIC Event'] } } });
    const responses = roles.map((element) => ({
      roleId: element.id,
      featureId: newFeature.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('USR_RoleFeatures', responses);
  },

  async down(queryInterface, Sequelize) {
    const newFeature = await USR_Feature.findOne({ where: { name: 'Progress Group' } });

    await queryInterface.bulkDelete(
      'USR_RoleFeatures',
      { featureId: newFeature.id },
      null,
    );
  },
};
