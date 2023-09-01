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

    //* REF_EventCategories
    const ref_eventcategories = JSON.parse(
      fs.readFileSync('./seeders/data/ref_eventcategories.json'),
    );
    const eventCategories = ref_eventcategories.map((element) => ({
      name: element.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('REF_EventCategories', eventCategories);

    //* REF_Regions
    const ref_regions = JSON.parse(
      fs.readFileSync('./seeders/data/ref_regions.json'),
    );
    const regions = ref_regions.map((element) => ({
      name: element.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('REF_Regions', regions);

    //* REF_GroupStatuses
    const ref_groupstatuses = JSON.parse(
      fs.readFileSync('./seeders/data/ref_groupstatuses.json'),
    );
    const groupStatuses = ref_groupstatuses.map((element) => ({
      name: element.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('REF_GroupStatuses', groupStatuses);

    //* REF_ParticipantTypes
    const ref_participanttypes = JSON.parse(
      fs.readFileSync('./seeders/data/ref_participanttypes.json'),
    );
    const participantTypes = ref_participanttypes.map((element) => ({
      name: element.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('REF_ParticipantTypes', participantTypes);

    //* REF_IdentityTypes
    const ref_identitytypes = JSON.parse(
      fs.readFileSync('./seeders/data/ref_identitytypes.json'),
    );
    const identityTypes = ref_identitytypes.map((element) => ({
      name: element.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('REF_IdentityTypes', identityTypes);

    //* REF_LocationTypes
    const ref_locationtypes = JSON.parse(
      fs.readFileSync('./seeders/data/ref_locationtypes.json'),
    );
    const locationTypes = ref_locationtypes.map((element) => ({
      name: element.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('REF_locationTypes', locationTypes);
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
    await queryInterface.bulkDelete('REF_EventCategories', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('REF_Regions', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('REF_GroupStatuses', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('REF_ParticipantTypes', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('REF_IdentityTypes', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('REF_LocationTypes', null, {
      truncate: true,
      restartIdentity: true,
    });
  },
};
