'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FNB_KitchenTarget extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FNB_KitchenTarget.init({
    menuId: DataTypes.INTEGER,
    kitchenId: DataTypes.INTEGER,
    date: DataTypes.DATEONLY,
    quantityTarget: DataTypes.INTEGER,
    quantityActual: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'FNB_KitchenTarget',
  });
  return FNB_KitchenTarget;
};