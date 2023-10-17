'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SYS_NotificationType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SYS_NotificationType.belongsToMany(models.USR_Role, {
        through: 'SYS_RoleNotificationSubscription',
        foreignKey: 'typeId',
        otherKey: 'roleId',
      });

      SYS_NotificationType.hasMany(models.SYS_Notification, { foreignKey: 'typeId', as: 'notifications' });
      SYS_NotificationType.hasMany(models.SYS_RoleNotificationSubscription, { foreignKey: 'typeId' });
    }
  }
  SYS_NotificationType.init({
    name: DataTypes.STRING,
    url: DataTypes.TEXT,
    relatedTable: DataTypes.STRING,
    messageFormat: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'SYS_NotificationType',
  });
  return SYS_NotificationType;
};
