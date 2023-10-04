/* eslint-disable no-unused-vars */

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.removeColumn('USR_Users', 'username');
    await queryInterface.sequelize.query('ALTER TABLE USR_Users DROP INDEX username');
  },

  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('USR_Users', 'username', {
      type: Sequelize.STRING,
      unique: true,
    });
  },
};
