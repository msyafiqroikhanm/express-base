'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'FNB_Schedules',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        picLocationId: {
          type: Sequelize.INTEGER,
        },
        picKitchenId: {
          type: Sequelize.INTEGER,
        },
        qrId: {
          type: Sequelize.INTEGER,
        },
        locationId: {
          type: Sequelize.INTEGER,
        },
        kitchenId: {
          type: Sequelize.INTEGER,
        },
        statusId: {
          type: Sequelize.INTEGER,
        },
        courierId: {
          type: Sequelize.INTEGER,
        },
        name: {
          type: Sequelize.STRING,
        },
        pickUpTime: {
          type: Sequelize.DATE,
        },
        dropOfTime: {
          type: Sequelize.DATE,
        },
        vehiclePlateNo: {
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
  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('FNB_Schedules');
  },
};
