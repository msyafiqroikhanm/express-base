'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class REF_FeedbackType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      REF_FeedbackType.hasMany(models.CSM_CustomerFeedback, { foreignKey: 'typeId', as: 'feedbacks' });
    }
  }
  REF_FeedbackType.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'REF_FeedbackType',
  });
  return REF_FeedbackType;
};
