'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CSM_ChatbotResponse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CSM_ChatbotResponse.belongsTo(models.REF_ChatBotResponseType, { foreignKey: 'responseTypeId', as: 'type' });
    }
  }
  CSM_ChatbotResponse.init({
    responseTypeId: DataTypes.INTEGER,
    message: DataTypes.TEXT,
    isActive: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'CSM_ChatbotResponse',
  });
  return CSM_ChatbotResponse;
};
