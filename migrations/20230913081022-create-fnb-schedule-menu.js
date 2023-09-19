'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'FNB_ScheduleMenus',
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
        menuId: {
          type: Sequelize.INTEGER,
        },
        quantity: {
          type: Sequelize.INTEGER,
        },
        isValid: {
          type: Sequelize.BOOLEAN,
        },
        note: {
          type: Sequelize.TEXT,
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
      {
        paranoid: true,
      },
    );
  },
  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('FNB_ScheduleMenus');
  },
};
