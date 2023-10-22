/* eslint-disable no-unused-vars */

'use strict';

const fs = require('fs');
const { Op } = require('sequelize');
const { USR_Role, USR_RoleFeature, USR_Feature } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const picHotelRole = await USR_Role.findOne({
      where: { name: { [Op.substring]: 'PIC Hotel' } },
    });

    if (picHotelRole) {
      const toBeDeletedFeature = await USR_Feature.findAll({
        where: {
          name: {
            [Op.in]: ['Delete Location Type', 'Update Location Type'],
          },
        },
        attributes: ['id'],
      });

      const features = toBeDeletedFeature.map((feature) => feature.id);

      await USR_RoleFeature.destroy({
        where: { roleId: picHotelRole.id, featureId: { [Op.in]: features } },
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const picHotelRole = await USR_Role.findOne({
      where: { name: { [Op.substring]: 'PIC Hotel' } },
      include: { model: USR_Feature, attributes: ['id'], through: { attributes: [] } },
    });
    if (picHotelRole) {
      const newFeatures = await USR_Feature.findAll({
        where: {
          name: {
            [Op.in]: ['Delete Location Type', 'Update Location Type'],
          },
        },
        attributes: ['id'],
      });
      // console.log(JSON.stringify(newFeatures, null, 2));

      const existFeatures = picHotelRole.USR_Features?.map((feature) => feature.id);
      // console.log(existFeatures);
      const newNonExistFeatures = newFeatures.filter(
        (feature) => !existFeatures.includes(feature.id),
      );
      // console.log(newNonExistFeatures);

      const newRoleFeatures = newNonExistFeatures.map((feature) => ({
        roleId: picHotelRole.id,
        featureId: feature.id,
      }));
      // console.log(newRoleFeatures);

      await USR_RoleFeature.bulkCreate(newRoleFeatures);
    }
  },
};
