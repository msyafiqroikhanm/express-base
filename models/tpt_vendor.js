'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TPT_Vendor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TPT_Vendor.hasMany(models.TPT_Vehicle, { foreignKey: 'vendorId', as: 'vehicles' });
    }
  }
  TPT_Vendor.init({
    name: DataTypes.STRING,
    address: DataTypes.TEXT,
    phoneNbr: DataTypes.STRING,
    email: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'TPT_Vendor',
    paranoid: true,
  });
  return TPT_Vendor;
};
