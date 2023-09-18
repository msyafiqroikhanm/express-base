'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TPT_SchedulePassenger extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TPT_SchedulePassenger.belongsTo(models.TPT_VehicleSchedule, { foreignKey: 'vehicleScheduleId' });
      TPT_SchedulePassenger.belongsTo(models.PAR_Participant, { foreignKey: 'participantId' });
      TPT_SchedulePassenger.belongsTo(models.REF_PassengerStatus, { foreignKey: 'statusId', as: 'status' });
    }
  }
  TPT_SchedulePassenger.init({
    vehicleScheduleId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    participantId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    statusId: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  }, {
    sequelize,
    modelName: 'TPT_SchedulePassenger',
  });
  return TPT_SchedulePassenger;
};
