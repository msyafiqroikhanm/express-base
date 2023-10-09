'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FNB_Feedbacks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      eventName: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.DATE
      },
      deliciousness: {
        type: Sequelize.INTEGER
      },
      combination: {
        type: Sequelize.INTEGER
      },
      suitability: {
        type: Sequelize.INTEGER
      },
      arrangement: {
        type: Sequelize.INTEGER
      },
      appearance: {
        type: Sequelize.INTEGER
      },
      cleanliness: {
        type: Sequelize.INTEGER
      },
      aroma: {
        type: Sequelize.INTEGER
      },
      freshness: {
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      contingent: {
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
    await queryInterface.dropTable('FNB_Feedbacks');
  }
};