/* eslint-disable no-unused-vars */

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'PAR_Participants',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        contingentId: {
          type: Sequelize.INTEGER,
        },
        qrId: {
          type: Sequelize.INTEGER,
        },
        typeId: {
          type: Sequelize.INTEGER,
        },
        committeeTypeId: {
          type: Sequelize.INTEGER,
        },
        identityTypeId: {
          type: Sequelize.INTEGER,
        },
        name: {
          type: Sequelize.STRING,
        },
        gender: {
          type: Sequelize.ENUM,
          values: ['Female', 'Male'],
        },
        birthDate: {
          type: Sequelize.DATEONLY,
        },
        identityNo: {
          type: Sequelize.STRING,
        },
        phoneNbr: {
          type: Sequelize.STRING,
        },
        email: {
          type: Sequelize.STRING,
        },
        address: {
          type: Sequelize.TEXT,
        },
        file: {
          type: Sequelize.STRING,
        },
        identityFile: {
          type: Sequelize.STRING,
        },
        baptismFile: {
          type: Sequelize.STRING,
        },
        referenceFile: {
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
    await queryInterface.dropTable('PAR_Participants');
  },
};
