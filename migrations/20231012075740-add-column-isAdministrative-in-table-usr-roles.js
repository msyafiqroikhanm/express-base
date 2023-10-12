'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('USR_Roles', 'isAdministrative', {
      type: Sequelize.BOOLEAN,
      after: 'name',
      defaultValue: true,
    });
  },

  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('USR_Roles', 'isAdministrative');
  },
};
