'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TPT_Vehicle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TPT_Vehicle.belongsTo(models.TPT_Vendor, { foreignKey: 'vendorId', as: 'vendor' });
      TPT_Vehicle.belongsTo(models.REF_VehicleType, { foreignKey: 'typeId', as: 'type' });
      TPT_Vehicle.belongsTo(models.QRM_QR, { foreignKey: 'qrId', as: 'qr' });

      TPT_Vehicle.hasMany(models.TPT_VehicleSchedule, { foreignKey: 'vehicleId', as: 'schedules' });
      TPT_Vehicle.hasMany(models.TPT_VehicleTracking, { foreignKey: 'vehicleId', as: 'trackings' });
    }
  }
  TPT_Vehicle.init({
    vendorId: DataTypes.INTEGER,
    typeId: DataTypes.INTEGER,
    qrId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    vehicleNo: DataTypes.STRING,
    vehiclePlateNo: DataTypes.STRING,
    capacity: DataTypes.INTEGER,
    isAvailable: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'TPT_Vehicle',
    paranoid: true,
  });
  return TPT_Vehicle;
};
