/* eslint-disable no-unused-vars */

'use strict';

const fs = require('fs');
const { Op } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const participantRole = JSON.parse(
      fs.readFileSync('./seeders/data/usr_roles_participant.json'),
    );
    const responses = participantRole.map((element) => ({
      name: element.name,
      templateId: element.templateId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('USR_Roles', responses);
  },

  async down(queryInterface, Sequelize) {
    const participantRole = JSON.parse(
      fs.readFileSync('./seeders/data/usr_roles_participant.json'),
    );

    const responses = participantRole.map((element) => element.name);
    await queryInterface.bulkDelete(
      'USR_Roles',
      { name: { [Op.in]: responses } },
      null,
    );
  },
};
