'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('TPT_VehicleSchedules', 'otherLocation', 'dropOffOtherLocation');
    await queryInterface.addColumn('TPT_VehicleSchedules', 'pickUpOtherLocation', {
      type: Sequelize.TEXT,
      after: 'dropOffTime',
    });
  },

  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('TPT_VehicleSchedules', 'dropOffOtherLocation', 'otherLocation');
    await queryInterface.removeColumn('TPT_VehicleSchedules', 'pickUpOtherLocation');
  },
};
