/* eslint-disable comma-dangle */

'use strict';

const fs = require('fs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    //* USR_Module
    const usr_modules = JSON.parse(
      fs.readFileSync('./seeders/data/usr_modules.json')
    );
    const modules = usr_modules.map((element) => ({
      name: element.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('USR_Modules', modules);

    //* USR_Feature
    const usr_features = JSON.parse(
      fs.readFileSync('./seeders/data/usr_features.json')
    );
    const features = usr_features.map((element) => ({
      moduleId: element.moduleId,
      name: element.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    // console.log(features);
    await queryInterface.bulkInsert('USR_Features', features);
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
  },
};
