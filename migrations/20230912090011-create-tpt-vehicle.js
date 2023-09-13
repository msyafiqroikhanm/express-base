/* eslint-disable no-unused-vars */

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'TPT_Vehicles',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        vendorId: {
          type: Sequelize.INTEGER,
        },
        typeId: {
          type: Sequelize.INTEGER,
        },
        qrId: {
          type: Sequelize.INTEGER,
        },
        name: {
          type: Sequelize.STRING,
        },
        vehicleNo: {
          type: Sequelize.STRING,
        },
        vehiclePlateNo: {
          type: Sequelize.STRING,
        },
        availableQuantity: {
          type: Sequelize.INTEGER,
        },
        capacity: {
          type: Sequelize.INTEGER,
        },
        isAvailable: {
          type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable('TPT_Vehicles');
  },
};
