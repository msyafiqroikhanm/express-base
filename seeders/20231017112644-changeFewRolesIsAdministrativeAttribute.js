/* eslint-disable no-unused-vars */

'use strict';

const fs = require('fs');
const { Op } = require('sequelize');
const { USR_Role } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await USR_Role.update({ isAdministrative: false }, { where: { name: { [Op.in]: ['Participant', 'Driver', 'Courier'] } } });
  },

  async down(queryInterface, Sequelize) {
    await USR_Role.update({ isAdministrative: true }, { where: { name: { [Op.in]: ['Participant', 'Driver', 'Courier'] } } });
  },
};
