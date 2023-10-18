/* eslint-disable no-unused-vars */

'use strict';

const fs = require('fs');
const { Op } = require('sequelize');
const { TPT_Driver, USR_User } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // tiki sutomo
    const userDriver = await USR_User.findOne({
      where: { username: 'driver1', email: 'driver1@jxboard.id' },
      attributes: ['id'],
    });
    await TPT_Driver.update({ userId: userDriver?.id }, { where: { name: 'Tiki Sutomo', phoneNbr: '6285780217401', email: 'tiki@jxboard.com' } });

    // Kruppe Situmpang
    await TPT_Driver.destroy({ where: { name: 'Kruppe Situmpang' } });
  },

  async down(queryInterface, Sequelize) {
    await TPT_Driver.update({ userId: null }, { where: { name: 'Tiki Sutomo', phoneNbr: '6285780217401', email: 'tiki@jxboard.com' } });

    await TPT_Driver.restore({ where: { name: 'Kruppe Situmpang' } });
  },
};
