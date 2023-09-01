'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ACM_Locations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      parentLocationId: {
        type: Sequelize.INTEGER
      },
      picId: {
        type: Sequelize.INTEGER
      },
      picItId: {
        type: Sequelize.INTEGER
      },
      typeId: {
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      address: {
        type: Sequelize.STRING
      },
      phoneNbr: {
        type: Sequelize.STRING
      },
      latitude: {
        type: Sequelize.STRING
      },
      longtitude: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ACM_Locations');
  }
};