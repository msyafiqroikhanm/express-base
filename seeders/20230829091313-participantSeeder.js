/* eslint-disable no-unused-vars */

'use strict';

const fs = require('fs');
const path = require('path');
const { createParticipantViaImport } = require('../services/participant.service');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    //* PAR_Contingents
    const par_contingets = JSON.parse(
      fs.readFileSync('./seeders/data/par_contingents.json'),
    );

    const identityTypes = par_contingets.map((element) => ({
      regionId: element.regionId,
      name: element.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('PAR_Contingents', identityTypes);

    //* PAR_Groups
    const par_contingentgroups = JSON.parse(
      fs.readFileSync('./seeders/data/par_contingentgroups.json'),
    );

    const contingentGroups = par_contingentgroups.map((element) => ({
      eventId: element.eventId,
      contingentId: element.contingentId,
      statusId: element.statusId,
      name: element.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('PAR_Groups', contingentGroups);

    await queryInterface.bulkInsert('PAR_Participants', [
      {
        name: 'Gifari',
        gender: 'Male',
        birthDate: '1999-01-01',
        identityNo: '31719032849',
        phoneNbr: '628763269240',
        email: 'gifari@jxboard.id',
        address: 'condet',
        identityTypeId: 1,
        typeId: 2,
        contingentId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ]);

    // await createParticipantViaImport({
    //   originalname: 'participant_example.xlsx',
    //   path: path.join(__dirname, '../seeders/data/participant_example.xlsx'),
    // });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('PAR_Contingents', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('PAR_Groups', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('PAR_Participants', null, {
      truncate: true,
      restartIdentity: true,
    });
  },
};
