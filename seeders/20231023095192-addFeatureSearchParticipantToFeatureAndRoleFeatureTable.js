/* eslint-disable no-unused-vars */

'use strict';

const fs = require('fs');
const { Op } = require('sequelize');
const {
  USR_Role, USR_RoleFeature, USR_Feature, USR_Module,
} = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let searchFeature = await USR_Feature.findOne({
      where: { name: { [Op.substring]: 'search participant' } },
      attributes: ['id'],
    });
    if (!searchFeature) {
      const participantModule = await USR_Module.findOne({
        where: { name: 'Participant', parentModuleId: { [Op.ne]: null } },
        attributes: ['id'],
      });
      searchFeature = await USR_Feature.create({
        name: 'Search Participant',
        moduleId: participantModule.id,
      });
    }

    const viewParticipantFeature = await USR_Feature.findOne({
      where: { name: { [Op.substring]: 'view participant' } },
      attributes: ['id'],
    });
    if (viewParticipantFeature) {
      const roleFeatures = await USR_RoleFeature.findAll({
        where: { featureId: viewParticipantFeature.id },
        attributes: ['featureId', 'roleId'],
      });

      const newRoleFeatures = roleFeatures.map((element) => ({
        roleId: element.roleId,
        featureId: searchFeature.id,
      }));

      await USR_RoleFeature.bulkCreate(newRoleFeatures);
    }
  },

  async down(queryInterface, Sequelize) {
    const searchFeature = await USR_Feature.findOne({
      where: { name: { [Op.substring]: 'search participant' } },
      attributes: ['id'],
    });

    if (searchFeature) {
      await USR_RoleFeature.destroy({ where: { featureId: searchFeature.id } });

      await searchFeature.destroy();
    }
  },
};
