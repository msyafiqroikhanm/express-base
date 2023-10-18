/* eslint-disable no-unused-vars */

('use strict');

const fs = require('fs');
const { Op } = require('sequelize');
const {
  USR_Role, USR_Module, USR_RoleFeature, USR_Feature,
} = require('../models');

const arrivalDepartureFeatureData = JSON.parse(
  fs.readFileSync('./seeders/data/usr_features_arrival_departure.json'),
);

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    //* Create Module
    let arrivalDepartureModule = await USR_Module.findOne({ where: { name: 'Arrival Departure' } });
    if (!arrivalDepartureModule) {
      const parentModule = await USR_Module.findOne({ where: { name: 'Transportation Management' } });
      arrivalDepartureModule = await USR_Module.create({
        parentModuleId: parentModule.id,
        name: 'Arrival Departure',
      });
    }

    //* Create Feature
    const arrivalDepartureFeatures = arrivalDepartureFeatureData.map((element) => ({
      moduleId: arrivalDepartureModule.id,
      name: element.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    const newFeatures = await USR_Feature.bulkCreate(arrivalDepartureFeatures, {
      returning: true,
    });
    const newFeatureIds = newFeatures.map((element) => element.id);

    //* create Role Feature
    const roleInstances = await USR_Role.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.substring]: 'super user' } },
          { name: { [Op.substring]: 'participant coordinator' } },
          { name: { [Op.substring]: 'admin participant' } },
        ],
      },
    });

    const roleFeatures = [];
    await roleInstances.forEach(async (role) => {
      const arrivalRoleFeatures = await newFeatureIds.map((element) => ({
        featureId: element,
        roleId: role.id,
      }));
      arrivalRoleFeatures.forEach((e) => {
        roleFeatures.push(e);
      });
    });

    await USR_RoleFeature.bulkCreate(roleFeatures);
  },

  async down(queryInterface, Sequelize) {
    const arrivalDepartureModule = await USR_Module.findOne({ where: { name: 'Arrival Departure' } });
    if (arrivalDepartureModule) {
      const arrivalDepartureFeatureInstance = await USR_Feature.findAll({
        where: { moduleId: arrivalDepartureModule.id },
      });
      const arrivalDepartureFeatureIds = arrivalDepartureFeatureInstance.map(
        (element) => element.id,
      );

      await USR_RoleFeature.destroy({
        where: { featureId: { [Op.in]: arrivalDepartureFeatureIds } },
      });

      await USR_Feature.destroy({ where: { moduleId: arrivalDepartureModule.id } });
    }
  },
};
