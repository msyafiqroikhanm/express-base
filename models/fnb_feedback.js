'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FNB_Feedback extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FNB_Feedback.init({
    eventName: DataTypes.STRING,
    date: DataTypes.DATE,
    deliciousness: DataTypes.INTEGER,
    combination: DataTypes.INTEGER,
    suitability: DataTypes.INTEGER,
    arrangement: DataTypes.INTEGER,
    appearance: DataTypes.INTEGER,
    cleanliness: DataTypes.INTEGER,
    aroma: DataTypes.INTEGER,
    freshness: DataTypes.INTEGER,
    name: DataTypes.STRING,
    contingent: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'FNB_Feedback',
  });
  return FNB_Feedback;
};