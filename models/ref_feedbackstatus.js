'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class REF_FeedbackStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      REF_FeedbackStatus.hasMany(models.CSM_CustomerFeedback, { foreignKey: 'statusId', as: 'feedbacks' });
    }
  }
  REF_FeedbackStatus.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'REF_FeedbackStatus',
  });
  return REF_FeedbackStatus;
};
