'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class REF_VehicleScheduleStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      REF_VehicleScheduleStatus.hasMany(models.TPT_VehicleSchedule, { foreignKey: 'statusId', as: 'schedules' });
    }
  }
  REF_VehicleScheduleStatus.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'REF_VehicleScheduleStatus',
  });
  return REF_VehicleScheduleStatus;
};
