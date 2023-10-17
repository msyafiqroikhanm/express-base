/* eslint-disable no-unused-vars */

'use strict';

const fs = require('fs');
const { Op } = require('sequelize');
const { USR_Feature, USR_Role, USR_RoleFeature } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const documentFeature = await USR_Feature.findOne({ where: { name: 'View Participant Document' }, attributes: ['id'] });
    const roles = await USR_Role.findAll({
      where: { name: { [Op.in]: ['Participant Coordinator', 'Participant', 'Admin Participant', 'Admin Pesperani'] } }, attributes: ['id'],
    });

    const roleFeatures = roles.map((element) => ({
      roleId: element.id,
      featureId: documentFeature.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert('USR_RoleFeatures', roleFeatures);
  },

  async down(queryInterface, Sequelize) {
    const documentFeature = await USR_Feature.findOne({ where: { name: 'View Participant Document' }, attributes: ['id'] });

    await queryInterface.bulkDelete(
      'USR_RoleFeatures',
      { featureId: documentFeature.id, roleId: { [Op.ne]: 1 } },
      null,
    );
  },
};
