'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('FNB_ScheduleHistories', 'note', {
      type: Sequelize.STRING,
      after: 'statusId',
    });
  },

  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('FNB_ScheduleHistories', 'note');
  },
};
