'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class REF_VehicleType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      REF_VehicleType.hasMany(models.TPT_Vehicle, { foreignKey: 'typeId', as: 'vehicles' });
    }
  }
  REF_VehicleType.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'REF_VehicleType',
  });
  return REF_VehicleType;
};
