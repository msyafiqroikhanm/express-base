/* eslint-disable no-unused-vars */

'use strict';

const fs = require('fs');
const { Op } = require('sequelize');
const { USR_Role } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const participantRole = await USR_Role.findOne({ where: { name: 'Participant' } });
    const participantFeatures = JSON.parse(
      fs.readFileSync('./seeders/data/usr_rolefeatures_participant.json'),
    );
    const responses = participantFeatures.map((element) => ({
      roleId: participantRole.id,
      featureId: element.featureId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('USR_RoleFeatures', responses);
  },

  async down(queryInterface, Sequelize) {
    const participantRole = await USR_Role.findOne({ where: { name: 'Participant' } });
    const participantFeatures = JSON.parse(
      fs.readFileSync('./seeders/data/usr_rolefeatures_participant.json'),
    );

    const responses = participantFeatures.map((element) => element.featureId);
    await queryInterface.bulkDelete(
      'USR_RoleFeatures',
      { roleId: participantRole.id, featureId: { [Op.in]: responses } },
      null,
    );
  },
};
