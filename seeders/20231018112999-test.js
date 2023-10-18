/* eslint-disable no-unused-vars */

'use strict';

const fs = require('fs');
const { Op } = require('sequelize');
const { REF_VehicleScheduleStatus } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await REF_VehicleScheduleStatus.create({ name: 'TEEEESSSTTT' });
  },

  async down(queryInterface, Sequelize) {
    await REF_VehicleScheduleStatus.destroy({ where: { name: 'TEEEESSSTTT' } });
  },
};
