'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CSM_CustomerFeedback extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CSM_CustomerFeedback.belongsTo(models.REF_FeedbackType, { foreignKey: 'typeId', as: 'type' });
      CSM_CustomerFeedback.belongsTo(models.REF_FeedbackTarget, { foreignKey: 'targetId', as: 'target' });
      CSM_CustomerFeedback.belongsTo(models.REF_FeedbackStatus, { foreignKey: 'statusId', as: 'status' });
    }
  }
  CSM_CustomerFeedback.init({
    typeId: DataTypes.INTEGER,
    targetId: DataTypes.INTEGER,
    statusId: DataTypes.INTEGER,
    customerName: DataTypes.STRING,
    longtitude: DataTypes.STRING,
    latitude: DataTypes.STRING,
    message: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'CSM_CustomerFeedback',
  });
  return CSM_CustomerFeedback;
};
