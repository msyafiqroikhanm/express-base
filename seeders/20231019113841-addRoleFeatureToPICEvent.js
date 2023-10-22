/* eslint-disable no-unused-vars */

'use strict';

const fs = require('fs');
const { Op } = require('sequelize');
const { USR_Role, USR_RoleFeature, USR_Feature } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const picEventRole = await USR_Role.findOne({
      where: { name: { [Op.substring]: 'PIC Event' } },
      include: { model: USR_Feature, attributes: ['id'], through: { attributes: [] } },
    });
    if (picEventRole) {
      const newFeatures = await USR_Feature.findAll({
        where: {
          name: {
            [Op.in]: [
              'View Event',
              'Create Event',
              'Update Event',
              'Delete Event',
              'View Group',
              'Progress Group',
              'View Dashboard',
            ],
          },
        },
        attributes: ['id'],
      });

      const existFeatures = picEventRole.USR_Features?.map((feature) => feature.id);
      const newNonExistFeatures = newFeatures.filter(
        (feature) => !existFeatures.includes(feature.id),
      );

      const newRoleFeatures = newNonExistFeatures.map((feature) => ({
        roleId: picEventRole.id,
        featureId: feature.id,
      }));

      await USR_RoleFeature.bulkCreate(newRoleFeatures);
    }
  },

  async down(queryInterface, Sequelize) {
    const picEventRole = await USR_Role.findOne({
      where: { name: { [Op.substring]: 'PIC Event' } },
      include: { model: USR_Feature, attributes: ['id', 'name'], through: { attributes: [] } },
    });

    if (picEventRole) {
      const newFeatures = await USR_Feature.findAll({
        where: {
          name: {
            [Op.in]: [
              'View Event',
              'Create Event',
              'Update Event',
              'Delete Event',
              'View Group',
              'Progress Group',
              'View Dashboard',
            ],
          },
        },
        attributes: ['id'],
      });

      const features = newFeatures.map((feature) => feature.id);

      await USR_RoleFeature.destroy({
        where: { roleId: picEventRole.id, featureId: { [Op.in]: features } },
      });
    }
  },
};
