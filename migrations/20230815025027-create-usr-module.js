/* eslint-disable no-unused-vars */

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'USR_Modules',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        parentModuleId: {
          type: Sequelize.INTEGER,
        },
        name: {
          type: Sequelize.STRING,
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('USR_Modules');
  },
};
