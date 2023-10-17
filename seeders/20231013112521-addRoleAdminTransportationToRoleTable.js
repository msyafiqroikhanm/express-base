/* eslint-disable no-unused-vars */

'use strict';

const fs = require('fs');
const { Op } = require('sequelize');

const { USR_Role } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await USR_Role.create({ name: 'Admin Transportation', templateId: 1 });
  },

  async down(queryInterface, Sequelize) {
    const participantRole = JSON.parse(
      fs.readFileSync('./seeders/data/usr_roles_participant.json'),
    );

    const responses = participantRole.map((element) => element.name);
    await USR_Role.destroy({ where: { name: 'Admin Transportation' } });
  },
};
