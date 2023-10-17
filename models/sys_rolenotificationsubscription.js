'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SYS_RoleNotificationSubscription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SYS_RoleNotificationSubscription.belongsTo(models.SYS_NotificationType, { foreignKey: 'typeId' });
      SYS_RoleNotificationSubscription.belongsTo(models.USR_Role, { foreignKey: 'roleId' });
    }
  }
  SYS_RoleNotificationSubscription.init({
    typeId: DataTypes.INTEGER,
    roleId: DataTypes.INTEGER,
    limitation: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'SYS_RoleNotificationSubscription',
  });
  return SYS_RoleNotificationSubscription;
};
