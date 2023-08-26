/* eslint-disable no-unused-vars */

'use strict';

const fs = require('fs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    //* REF_configurationCategory
    const ref_configurationcategories = JSON.parse(
      fs.readFileSync('./seeders/data/ref_configurationcategories.json'),
    );
    const categories = ref_configurationcategories.map((element) => ({
      name: element.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('REF_ConfigurationCategories', categories);

    //* REF_qrtype
    const ref_qrtypes = JSON.parse(
      fs.readFileSync('./seeders/data/ref_qrtypes.json'),
    );
    const qrTypes = ref_qrtypes.map((element) => ({
      name: element.name,
      label: element.label,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('REF_QRTypes', qrTypes);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('REF_ConfigurationCategories', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('REF_QRTypes', null, {
      truncate: true,
      restartIdentity: true,
    });
  },
};
