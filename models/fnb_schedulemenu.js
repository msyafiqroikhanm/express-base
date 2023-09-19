'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FNB_ScheduleMenu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FNB_ScheduleMenu.belongsTo(models.FNB_Schedule, { foreignKey: 'scheduleId', as: 'schedule' });
      FNB_ScheduleMenu.belongsTo(models.FNB_Menu, { foreignKey: 'menuId', as: 'menu' });
    }
  }
  FNB_ScheduleMenu.init(
    {
      scheduleId: DataTypes.INTEGER,
      menuId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      isValid: DataTypes.BOOLEAN,
      note: DataTypes.TEXT,
    },
    {
      sequelize,
      paranoid: true,
      deletedAt: 'deletedAt',
      modelName: 'FNB_ScheduleMenu',
    },
  );
  return FNB_ScheduleMenu;
};
