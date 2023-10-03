'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('FNB_Menus', 'date', {
      type: Sequelize.DATEONLY,
      after: 'foodTypeId',
    });
  },

  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('FNB_Menus', 'date');
  },
};
