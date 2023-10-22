'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TPT_VehicleScheduleHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TPT_VehicleScheduleHistory.belongsTo(models.TPT_VehicleSchedule, { foreignKey: 'vehicleScheduleId', as: 'schedule' });
      TPT_VehicleScheduleHistory.belongsTo(models.REF_VehicleScheduleStatus, { foreignKey: 'statusId', as: 'status' });
    }
  }
  TPT_VehicleScheduleHistory.init({
    vehicleScheduleId: DataTypes.INTEGER,
    statusId: DataTypes.INTEGER,
    note: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'TPT_VehicleScheduleHistory',
  });
  return TPT_VehicleScheduleHistory;
};
