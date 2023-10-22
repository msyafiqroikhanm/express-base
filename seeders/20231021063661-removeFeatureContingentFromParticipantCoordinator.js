/* eslint-disable no-unused-vars */

'use strict';

const fs = require('fs');
const { Op } = require('sequelize');
const { USR_Role, USR_RoleFeature, USR_Feature } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const participantCoorRole = await USR_Role.findOne({
      where: { name: { [Op.substring]: 'Participant Coordinator' } },
    });

    if (participantCoorRole) {
      const toBeDeletedFeature = await USR_Feature.findAll({
        where: {
          name: {
            [Op.in]: ['Create Contingent', 'Update Contingent', 'Delete Contingent'],
          },
        },
        attributes: ['id'],
      });

      const features = toBeDeletedFeature.map((feature) => feature.id);

      await USR_RoleFeature.destroy({
        where: { roleId: participantCoorRole.id, featureId: { [Op.in]: features } },
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const participantCoorRole = await USR_Role.findOne({
      where: { name: { [Op.substring]: 'Participant Coordinator' } },
      include: { model: USR_Feature, attributes: ['id'], through: { attributes: [] } },
    });
    if (participantCoorRole) {
      const newFeatures = await USR_Feature.findAll({
        where: {
          name: {
            [Op.in]: ['Create Contingent', 'Update Contingent', 'Delete Contingent'],
          },
        },
        attributes: ['id'],
      });

      const existFeatures = participantCoorRole.USR_Features?.map((feature) => feature.id);
      const newNonExistFeatures = newFeatures.filter(
        (feature) => !existFeatures.includes(feature.id),
      );

      const newRoleFeatures = newNonExistFeatures.map((feature) => ({
        roleId: participantCoorRole.id,
        featureId: feature.id,
      }));

      await USR_RoleFeature.bulkCreate(newRoleFeatures);
    }
  },
};
