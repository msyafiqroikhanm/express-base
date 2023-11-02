'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class REF_FoodScheduleStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  REF_FoodScheduleStatus.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'REF_FoodScheduleStatus',
    },
  );
  return REF_FoodScheduleStatus;
};
