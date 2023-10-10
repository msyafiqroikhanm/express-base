'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('FNB_Kitchens', 'productionCapacity', {
      type: Sequelize.INTEGER,
      after: 'name',
    });
  },

  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('FNB_Kitchens', 'productionCapacity');
  },
};
