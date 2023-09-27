'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('FNB_KitchenTargets', 'deletedAt', {
      type: Sequelize.DATE,
      after: 'quantityActual',
    });
  },

  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('FNB_KitchenTargets', 'deletedAt');
  },
};
