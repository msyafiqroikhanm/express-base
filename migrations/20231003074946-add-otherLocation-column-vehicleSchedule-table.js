'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('TPT_VehicleSchedules', 'otherLocation', {
      type: Sequelize.TEXT,
      after: 'dropOffTime',
    });
    await queryInterface.addColumn('TPT_VehicleSchedules', 'description', {
      type: Sequelize.TEXT,
      after: 'otherLocation',
    });
  },

  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('TPT_VehicleSchedules', 'otherLocation');
    await queryInterface.removeColumn('TPT_VehicleSchedules', 'description');
  },
};
