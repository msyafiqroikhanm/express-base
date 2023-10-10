/* eslint-disable no-unused-vars */

'use strict';

const fs = require('fs');
const { Op } = require('sequelize');
const { ACM_Location, REF_LocationType } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const otherLocationType = await REF_LocationType.create({ name: 'Other' });

    await ACM_Location.create({
      typeId: otherLocationType.id,
      name: 'Other',
    });
  },

  async down(queryInterface, Sequelize) {
    await ACM_Location.destroy({ where: { name: 'Other' } });
    await REF_LocationType.destroy({ where: { name: 'Other' } });
  },
};
