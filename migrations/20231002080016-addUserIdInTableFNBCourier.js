'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('FNB_Couriers', 'userId', {
      type: Sequelize.INTEGER,
      after: 'id',
    });
  },

  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('FNB_Couriers', 'userId');
  },
};
