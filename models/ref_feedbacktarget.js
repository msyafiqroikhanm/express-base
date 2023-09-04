'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class REF_FeedbackTarget extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      REF_FeedbackTarget.hasMany(models.CSM_CustomerFeedback, { foreignKey: 'targetId', as: 'feedbacks' });
    }
  }
  REF_FeedbackTarget.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'REF_FeedbackTarget',
  });
  return REF_FeedbackTarget;
};
