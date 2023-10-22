'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'FNB_ScheduleHistories',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        scheduleId: {
          type: Sequelize.INTEGER,
        },
        statusId: {
          type: Sequelize.INTEGER,
        },
        deletedAt: {
          type: Sequelize.DATE,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      },
      { paranoid: true },
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('FNB_ScheduleHistories');
  },
};
