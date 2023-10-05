'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CSM_TelegramConversation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CSM_TelegramConversation.init({
    chatId: DataTypes.STRING,
    name: DataTypes.STRING,
    timeStamp: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'CSM_TelegramConversation',
  });
  return CSM_TelegramConversation;
};
