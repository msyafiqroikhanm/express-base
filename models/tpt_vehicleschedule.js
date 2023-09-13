'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TPT_VehicleSchedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TPT_VehicleSchedule.belongsToMany(models.PAR_Participant, {
        through: 'TPT_SchedulePassenger',
        foreignKey: 'vehicleScheduleId',
        otherKey: 'participantId',
      });

      TPT_VehicleSchedule.belongsTo(models.TPT_Driver, { foreignKey: 'driverId', as: 'driver' });
      TPT_VehicleSchedule.belongsTo(models.TPT_Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });
      TPT_VehicleSchedule.belongsTo(models.REF_VehicleScheduleStatus, { foreignKey: 'statusId', as: 'status' });
      TPT_VehicleSchedule.belongsTo(models.ACM_Location, { foreignKey: 'pickUpId', as: 'pickUp' });
      TPT_VehicleSchedule.belongsTo(models.ACM_Location, { foreignKey: 'destinationId', as: 'destination' });

      TPT_VehicleSchedule.hasMany(models.TPT_SchedulePassenger, { foreignKey: 'vehicleScheduleId' });
    }
  }
  TPT_VehicleSchedule.init({
    driverId: DataTypes.INTEGER,
    vehicleId: DataTypes.INTEGER,
    pickUpId: DataTypes.INTEGER,
    destinationId: DataTypes.INTEGER,
    statusId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    pickUpTime: DataTypes.DATE,
    dropOffTime: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'TPT_VehicleSchedule',
  });
  return TPT_VehicleSchedule;
};
