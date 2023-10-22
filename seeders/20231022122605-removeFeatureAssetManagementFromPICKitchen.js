/* eslint-disable no-unused-vars */

'use strict';

const fs = require('fs');
const { Op } = require('sequelize');
const { USR_Role, USR_RoleFeature, USR_Feature } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const picKitchenRole = await USR_Role.findOne({
      where: { name: { [Op.substring]: 'PIC Kitchen' } },
    });

    if (picKitchenRole) {
      const toBeDeletedFeature = await USR_Feature.findAll({
        where: {
          name: {
            [Op.in]: [
              'View Menu Type',
              'Create Menu Type',
              'Update Menu Type',
              'Delete Menu Type',
              'View FNB Schedule Menu',
              'Create FNB Schedule Menu',
              'Update FNB Schedule Menu',
              'Delete FNB Schedule Menu',
            ],
          },
        },
        attributes: ['id'],
      });

      const features = toBeDeletedFeature.map((feature) => feature.id);

      await USR_RoleFeature.destroy({
        where: { roleId: picKitchenRole.id, featureId: { [Op.in]: features } },
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const picKitchenRole = await USR_Role.findOne({
      where: { name: { [Op.substring]: 'PIC Kitchen' } },
      include: { model: USR_Feature, attributes: ['id'], through: { attributes: [] } },
    });
    if (picKitchenRole) {
      const newFeatures = await USR_Feature.findAll({
        where: {
          name: {
            [Op.in]: [
              'View Menu Type',
              'Create Menu Type',
              'Update Menu Type',
              'Delete Menu Type',
              'View FNB Schedule Menu',
              'Create FNB Schedule Menu',
              'Update FNB Schedule Menu',
              'Delete FNB Schedule Menu',
            ],
          },
        },
        attributes: ['id'],
      });

      const existFeatures = picKitchenRole.USR_Features?.map((feature) => feature.id);
      const newNonExistFeatures = newFeatures.filter(
        (feature) => !existFeatures.includes(feature.id),
      );

      const newRoleFeatures = newNonExistFeatures.map((feature) => ({
        roleId: picKitchenRole.id,
        featureId: feature.id,
      }));

      await USR_RoleFeature.bulkCreate(newRoleFeatures);
    }
  },
};
