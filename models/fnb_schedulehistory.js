'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FNB_ScheduleHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FNB_ScheduleHistory.belongsTo(models.REF_FoodScheduleStatus, {
        foreignKey: 'statusId',
        as: 'status',
      });
      FNB_ScheduleHistory.belongsTo(models.FNB_Schedule, {
        foreignKey: 'scheduleId',
        as: 'schedule',
      });
    }
  }
  FNB_ScheduleHistory.init(
    {
      scheduleId: DataTypes.INTEGER,
      statusId: DataTypes.INTEGER,
      note: DataTypes.STRING,
    },
    {
      sequelize,
      paranoid: true,
      deletedAt: 'deletedAt',
      modelName: 'FNB_ScheduleHistory',
    },
  );
  return FNB_ScheduleHistory;
};
