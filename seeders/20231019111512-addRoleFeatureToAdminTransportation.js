/* eslint-disable no-unused-vars */

'use strict';

const fs = require('fs');
const { Op } = require('sequelize');
const { USR_Role, USR_RoleFeature, USR_Feature } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const adminTransportRole = await USR_Role.findOne({
      where: { name: { [Op.substring]: 'Admin Transportation' } },
      include: { model: USR_Feature, attributes: ['id'], through: { attributes: [] } },
    });
    if (adminTransportRole) {
      const newFeatures = await USR_Feature.findAll({
        where: {
          name: {
            [Op.in]: [
              'Create Vendor',
              'Update Vendor',
              'Delete Vendor',
              'Create Vehicle',
              'Update Vehicle',
              'Delete Vehicle',
              'Create Driver',
              'Update Driver',
              'Delete Driver',
            ],
          },
        },
        attributes: ['id'],
      });

      const existFeatures = adminTransportRole.USR_Features?.map((feature) => feature.id);
      const newNonExistFeatures = newFeatures.filter(
        (feature) => !existFeatures.includes(feature.id),
      );

      const newRoleFeatures = newNonExistFeatures.map((feature) => ({
        roleId: adminTransportRole.id,
        featureId: feature.id,
      }));

      await USR_RoleFeature.bulkCreate(newRoleFeatures);
    }
  },

  async down(queryInterface, Sequelize) {
    const adminTransportRole = await USR_Role.findOne({
      where: { name: { [Op.substring]: 'Admin Transportation' } },
      include: { model: USR_Feature, attributes: ['id', 'name'], through: { attributes: [] } },
    });

    if (adminTransportRole) {
      const newFeatures = await USR_Feature.findAll({
        where: {
          name: {
            [Op.in]: [
              'Create Vendor',
              'Update Vendor',
              'Delete Vendor',
              'Create Vehicle',
              'Update Vehicle',
              'Delete Vehicle',
              'Create Driver',
              'Update Driver',
              'Delete Driver',
            ],
          },
        },
        attributes: ['id'],
      });

      const features = newFeatures.map((feature) => feature.id);

      await USR_RoleFeature.destroy({
        where: { roleId: adminTransportRole.id, featureId: { [Op.in]: features } },
      });
    }
  },
};
