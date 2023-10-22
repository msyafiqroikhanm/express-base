'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('TPT_VehicleSchedules', 'description', 'descriptionPickUp');
    await queryInterface.addColumn('TPT_VehicleSchedules', 'descriptionDropOff', {
      type: Sequelize.TEXT,
      after: 'descriptionPickUp',
    });
  },

  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('TPT_VehicleSchedules', 'descriptionPickUp', 'description');
    await queryInterface.removeColumn('TPT_VehicleSchedules', 'descriptionDropOff');
  },
};
