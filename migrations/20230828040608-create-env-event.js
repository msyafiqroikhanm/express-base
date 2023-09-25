/* eslint-disable lines-around-directive */
/* eslint-disable no-unused-vars */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'ENV_Events',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        picId: {
          type: Sequelize.INTEGER,
        },
        categoryId: {
          type: Sequelize.INTEGER,
        },
        locationId: {
          type: Sequelize.INTEGER,
        },
        name: {
          type: Sequelize.STRING,
        },
        code: {
          type: Sequelize.STRING,
        },
        minAge: {
          type: Sequelize.INTEGER,
        },
        maxAge: {
          type: Sequelize.INTEGER,
        },
        maxParticipantPerGroup: {
          type: Sequelize.INTEGER,
        },
        maxTotalParticipant: {
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
      {
        paranoid: true,
      },
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ENV_Events');
  },
};
