/* eslint-disable no-unused-vars */

('use strict');

const fs = require('fs');
const { Op } = require('sequelize');
const { USR_Role, USR_Module, USR_RoleFeature, USR_Feature } = require('../models');

const menuTypesFeaturesData = JSON.parse(
  fs.readFileSync('./seeders/data/usr_features_menu_types.json'),
);

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    //* Create Module
    let menuTypeModuleInstance = await USR_Module.findOne({ where: { name: 'Menu Type' } });
    if (!menuTypeModuleInstance) {
      const parentModule = await USR_Module.findOne({ where: { name: 'Asset Management' } });
      menuTypeModuleInstance = await USR_Module.create({
        parentModuleId: parentModule.id,
        name: 'Menu Type',
      });
    }

    //* Create Feature
    const menuTypesFeatures = menuTypesFeaturesData.map((element) => ({
      moduleId: menuTypeModuleInstance.id,
      name: element.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    const newMenuTypsFeatures = await USR_Feature.bulkCreate(menuTypesFeatures, {
      returning: true,
    });
    const menuTypeFeaturesIds = newMenuTypsFeatures.map((element) => element.id);
    // console.log(menuTypeFeaturesIds);

    //* create Role Feature
    const roleInstances = await USR_Role.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.substring]: 'super user' } },
          { name: { [Op.substring]: 'admin fnb' } },
          { name: { [Op.substring]: 'pic kitchen' } },
        ],
      },
    });

    const roleFeatures = [];
    await roleInstances.forEach(async (role) => {
      const menuTypeRoleFeatures = await menuTypeFeaturesIds.map((element) => ({
        featureId: element,
        roleId: role.id,
      }));
      menuTypeRoleFeatures.forEach((e) => {
        roleFeatures.push(e);
      });
    });

    await USR_RoleFeature.bulkCreate(roleFeatures);
  },

  async down(queryInterface, Sequelize) {
    const menuTypeModuleInstance = await USR_Module.findOne({ where: { name: 'Menu Type' } });
    if (menuTypeModuleInstance) {
      const menuTypeFeatureInstances = await USR_Feature.findAll({
        where: { moduleId: menuTypeModuleInstance.id },
      });
      const menuTypeFeaturesIds = menuTypeFeatureInstances.map((element) => element.id);
      // console.log(menuTypeFeaturesIds);
      await USR_RoleFeature.destroy({
        where: { featureId: { [Op.in]: menuTypeFeaturesIds } },
      });

      await USR_Feature.destroy({ where: { moduleId: menuTypeModuleInstance.id } });
      await menuTypeModuleInstance.destroy();
    }
  },
};
