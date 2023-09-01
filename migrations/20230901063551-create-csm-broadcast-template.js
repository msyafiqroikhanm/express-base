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
      name: {
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
      headerType: {
        type: Sequelize.ENUM,
        values: ['Text', 'Image', 'Document', 'Video'],
      },
      headerText: {
        type: Sequelize.STRING,
      },
      isHeaderVariable: {
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
