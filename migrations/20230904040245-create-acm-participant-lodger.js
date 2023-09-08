/* eslint-disable no-unused-vars */

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'ACM_ParticipantLodgers',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        participantId: {
          type: Sequelize.INTEGER,
        },
        statusId: {
          type: Sequelize.INTEGER,
        },
        roomId: {
          type: Sequelize.INTEGER,
        },
        reservationIn: {
          type: Sequelize.DATEONLY,
        },
        reservationOut: {
          type: Sequelize.DATEONLY,
        },
        checkIn: {
          type: Sequelize.DATE,
        },
        checkout: {
          type: Sequelize.DATE,
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
    await queryInterface.dropTable('ACM_ParticipantLodgers');
  },
};
