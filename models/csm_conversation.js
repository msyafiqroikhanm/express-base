'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CSM_Conversation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CSM_Conversation.init({
    name: DataTypes.STRING,
    phoneNbr: DataTypes.STRING,
    timeStamp: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'CSM_Conversation',
  });
  return CSM_Conversation;
};
