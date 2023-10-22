'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('TPT_VehicleSchedules', 'type', {
      type: Sequelize.ENUM,
      values: ['Arrival & Departure', 'Event', 'Tourism'],
      defaultValue: 'Event',
      after: 'id',
    });
    await queryInterface.addColumn('TPT_VehicleSchedules', 'totalPassengers', {
      type: Sequelize.INTEGER,
    });
  },

  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('TPT_VehicleSchedules', 'type');
    await queryInterface.removeColumn('TPT_VehicleSchedules', 'totalPassengers');
  },
};
