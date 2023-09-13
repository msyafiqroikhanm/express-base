'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TPT_VehicleTracking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TPT_VehicleTracking.belongsTo(models.TPT_Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });
    }
  }
  TPT_VehicleTracking.init({
    vehicleId: DataTypes.INTEGER,
    latitude: DataTypes.STRING,
    longtitude: DataTypes.STRING,
    accuracy: DataTypes.STRING,
    time: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'TPT_VehicleTracking',
  });
  return TPT_VehicleTracking;
};
