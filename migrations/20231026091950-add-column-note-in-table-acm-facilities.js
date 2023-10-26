'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('ACM_Facilities', 'note', {
      type: Sequelize.STRING,
      after: 'quantity',
    });
  },

  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('ACM_Facilities', 'note');
  },
};
