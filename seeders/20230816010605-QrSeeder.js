/* eslint-disable no-unused-vars */

'use strict';

const fs = require('fs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    //* QRM_QRTemplates
    const qr_qrTemplates = JSON.parse(
      fs.readFileSync('./seeders/data/qrm_qrtemplates.json'),
    );
    const qrTemplates = qr_qrTemplates.map((element) => ({
      typeId: element.typeId,
      name: element.name,
      file: element.file,
      xCoordinate: element.xCoordinate,
      yCoordinate: element.yCoordinate,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('QRM_QRTemplates', qrTemplates);

    //* QRM_QRs
    const qr_qrs = JSON.parse(
      fs.readFileSync('./seeders/data/qrm_qrs.json'),
    );
    const qrs = qr_qrs.map((element) => ({
      templateId: element.templateId,
      code: element.code,
      rawFile: element.rawFile,
      combineFile: element.combineFile,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('QRM_QRs', qrs);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('QRM_QRTemplates', null, {
      truncate: true,
      restartIdentity: true,
    });

    await queryInterface.bulkDelete('QRM_QRs', null, {
      truncate: true,
      restartIdentity: true,
    });
  },
};
