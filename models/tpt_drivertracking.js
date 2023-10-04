'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TPT_DriverTracking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TPT_DriverTracking.belongsTo(models.TPT_Driver, { foreignKey: 'driverId' });
    }
  }
  TPT_DriverTracking.init({
    driverId: DataTypes.INTEGER,
    latitude: DataTypes.STRING,
    longtitude: DataTypes.STRING,
    accuracy: DataTypes.STRING,
    time: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'TPT_DriverTracking',
  });
  return TPT_DriverTracking;
};
