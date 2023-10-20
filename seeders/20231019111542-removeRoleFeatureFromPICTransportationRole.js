/* eslint-disable no-unused-vars */

'use strict';

const fs = require('fs');
const { Op } = require('sequelize');
const { USR_Role, USR_RoleFeature, USR_Feature } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const picTransportRole = await USR_Role.findOne({
      where: { name: { [Op.substring]: 'PIC Transportation' } },
    });

    if (picTransportRole) {
      const toBeDeletedFeature = await USR_Feature.findAll({
        where: {
          name: {
            [Op.in]: [
              'View Participant',
              'View Contingent',
              'View Location',
              'View PIC',
            ],
          },
        },
        attributes: ['id'],
      });

      const features = toBeDeletedFeature.map((feature) => feature.id);

      await USR_RoleFeature.destroy({
        where: { roleId: picTransportRole.id, featureId: { [Op.in]: features } },
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const picTransportRole = await USR_Role.findOne({
      where: { name: { [Op.substring]: 'PIC Transportation' } },
      include: { model: USR_Feature, attributes: ['id'], through: { attributes: [] } },
    });
    if (picTransportRole) {
      const newFeatures = await USR_Feature.findAll({
        where: {
          name: {
            [Op.in]: [
              'View Participant',
              'View Contingent',
              'View Location',
              'View PIC',
            ],
          },
        },
        attributes: ['id'],
      });

      const existFeatures = picTransportRole.USR_Features?.map((feature) => feature.id);
      const newNonExistFeatures = newFeatures.filter(
        (feature) => !existFeatures.includes(feature.id),
      );

      const newRoleFeatures = newNonExistFeatures.map((feature) => ({
        roleId: picTransportRole.id,
        featureId: feature.id,
      }));

      await USR_RoleFeature.bulkCreate(newRoleFeatures);
    }
  },
};
