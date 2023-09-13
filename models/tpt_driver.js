'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TPT_Driver extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TPT_Driver.belongsTo(models.TPT_Vendor, { foreignKey: 'vendorId', as: 'vendor' });

      TPT_Driver.hasMany(models.TPT_VehicleSchedule, { foreignKey: 'driverId', as: 'schedules' });
    }
  }
  TPT_Driver.init({
    vendorId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    phoneNbr: DataTypes.STRING,
    email: DataTypes.STRING,
    isAvailable: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'TPT_Driver',
    paranoid: true,
  });
  return TPT_Driver;
};
