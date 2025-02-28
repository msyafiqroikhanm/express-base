'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class REF_ChatBotResponseType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      REF_ChatBotResponseType.hasMany(models.CSM_ChatbotResponse, { foreignKey: 'responseTypeId', as: 'responses' });
    }
  }
  REF_ChatBotResponseType.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'REF_ChatBotResponseType',
  });
  return REF_ChatBotResponseType;
};
