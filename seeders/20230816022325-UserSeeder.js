/* eslint-disable comma-dangle */

'use strict';

const fs = require('fs');
const bcryptjs = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    //* USR_Module
    const usr_modules = JSON.parse(fs.readFileSync('./seeders/data/usr_modules.json'));
    const modules = usr_modules.map((element) => ({
      name: element.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('USR_Modules', modules);

    //* USR_Feature
    const usr_features = JSON.parse(fs.readFileSync('./seeders/data/usr_features.json'));
    const features = usr_features.map((element) => ({
      moduleId: element.moduleId,
      name: element.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    // console.log(features);
    await queryInterface.bulkInsert('USR_Features', features);

    //* USR_Roles
    const usr_roles = JSON.parse(fs.readFileSync('./seeders/data/usr_roles.json'));
    const roles = usr_roles.map((element) => ({
      name: element.name,
      templateId: element.templateId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    // console.log(roles);
    await queryInterface.bulkInsert('USR_Roles', roles);

    //* USR_RoleFeatures
    const usr_rolefeatures = JSON.parse(fs.readFileSync('./seeders/data/usr_rolefeatures.json'));
    const roleFeatures = usr_rolefeatures.map((element) => ({
      roleId: element.roleId,
      featureId: element.featureId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    // console.log(roleFeatures);
    await queryInterface.bulkInsert('USR_RoleFeatures', roleFeatures);

    //* USR_Users
    const usr_users = JSON.parse(fs.readFileSync('./seeders/data/usr_users.json'));
    const salt = bcryptjs.genSaltSync(10);
    const users = usr_users.map((element) => ({
      qrId: element.qrId,
      roleId: element.roleId,
      participantId: element.participantId,
      username: element.username,
      email: element.email,
      password: bcryptjs.hashSync(`${element.username}.123`, salt),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    // console.log(users);
    await queryInterface.bulkInsert('USR_Users', users);

    //* USR_PICs
    const usr_pics = JSON.parse(fs.readFileSync('./seeders/data/usr_pics.json'));
    const pics = usr_pics.map((element) => ({
      userId: element.userId,
      typeId: element.typeId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    // console.log(pics);
    await queryInterface.bulkInsert('USR_PICs', pics);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('USR_Modules', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('USR_Features', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('USR_Roles', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('USR_RoleFeatures', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('USR_Users', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('USR_PICs', null, {
      truncate: true,
      restartIdentity: true,
    });
  },
};
