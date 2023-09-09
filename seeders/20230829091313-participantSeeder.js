/* eslint-disable no-unused-vars */

'use strict';

const fs = require('fs');
const path = require('path');
const { createParticipantViaImport } = require('../services/participant.service');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    //* PAR_Contingents
    const par_contingets = JSON.parse(fs.readFileSync('./seeders/data/par_contingents.json'));

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

    // * PAR_Participants
    const par_participants = JSON.parse(
      fs.readFileSync('./seeders/data/par_participants.json'),
    );
    const participants = par_participants.map((element) => ({
      name: element.name,
      gender: element.gender,
      birthDate: element.birthDate,
      identityNo: element.identityNo,
      phoneNbr: element.phoneNbr,
      email: element.email,
      address: element.address,
      identityTypeId: element.identityTypeId,
      typeId: element.typeId,
      contingentId: element.contingentId,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    }));
    await queryInterface.bulkInsert('PAR_Participants', participants);

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
