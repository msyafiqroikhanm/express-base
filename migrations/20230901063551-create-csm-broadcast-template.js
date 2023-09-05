/* eslint-disable no-unused-vars */

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CSM_BroadcastTemplates', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      categoryId: {
        type: Sequelize.INTEGER,
      },
      metaCategoryId: {
        type: Sequelize.INTEGER,
      },
      headerTypeId: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      language: {
        type: Sequelize.STRING,
      },
      message: {
        type: Sequelize.TEXT,
      },
      messageVariableNumber: {
        type: Sequelize.INTEGER,
      },
      messageVariableExample: {
        type: Sequelize.JSON,
      },
      headerText: {
        type: Sequelize.STRING,
      },
      haveHeaderVariable: {
        type: Sequelize.BOOLEAN,
      },
      headerVariableExample: {
        type: Sequelize.STRING,
      },
      headerFile: {
        type: Sequelize.STRING,
      },
      footer: {
        type: Sequelize.STRING,
      },
      button: {
        type: Sequelize.JSON,
      },
      metaStatus: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CSM_BroadcastTemplates');
  },
};
