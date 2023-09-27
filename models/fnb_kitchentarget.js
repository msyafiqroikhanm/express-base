/* eslint-disable no-unused-vars */

'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FNB_KitchenTarget extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FNB_KitchenTarget.belongsTo(models.FNB_Menu, { foreignKey: 'menuId', as: 'menu' });
      FNB_KitchenTarget.belongsTo(models.FNB_Kitchen, { foreignKey: 'kitchenId', as: 'kitchen' });
    }
  }
  FNB_KitchenTarget.init(
    {
      menuId: DataTypes.INTEGER,
      kitchenId: DataTypes.INTEGER,
      date: DataTypes.DATEONLY,
      quantityTarget: DataTypes.INTEGER,
      quantityActual: DataTypes.INTEGER,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      paranoid: true,
      deletedAt: 'deletedAt',
      modelName: 'FNB_KitchenTarget',
    },
  );
  return FNB_KitchenTarget;
};
