'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FNB_Menu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FNB_Menu.hasMany(models.FNB_Menu, { foreignKey: 'parentMenuId', as: 'child' });
      FNB_Menu.belongsTo(models.FNB_Menu, { foreignKey: 'parentMenuId', as: 'parent' });
      FNB_Menu.belongsTo(models.REF_MenuType, { foreignKey: 'menuTypeId', as: 'menuType' });
      FNB_Menu.belongsTo(models.REF_FoodType, { foreignKey: 'foodTypeId', as: 'foodType' });
    }
  }
  FNB_Menu.init(
    {
      parentMenuId: DataTypes.INTEGER,
      menuTypeId: DataTypes.INTEGER,
      foodTypeId: DataTypes.INTEGER,
      date: DataTypes.DATEONLY,
      name: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      paranoid: true,
      deletedAt: 'deletedAt',
      modelName: 'FNB_Menu',
    },
  );
  return FNB_Menu;
};
