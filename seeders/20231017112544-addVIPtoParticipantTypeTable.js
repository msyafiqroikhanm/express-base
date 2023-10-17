/* eslint-disable no-unused-vars */

'use strict';

const fs = require('fs');
const { Op } = require('sequelize');
const { REF_ParticipantType } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await REF_ParticipantType.create({ name: 'VIP' });
  },

  async down(queryInterface, Sequelize) {
    await REF_ParticipantType.destroy({ where: { name: 'VIP' } });
  },
};
