'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SYS_Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SYS_Notification.belongsTo(models.USR_User, { foreignKey: 'userId', as: 'user' });
    }
  }
  SYS_Notification.init({
    userId: DataTypes.INTEGER,
    typeId: DataTypes.INTEGER,
    relatedDataId: DataTypes.INTEGER,
    url: DataTypes.TEXT,
    message: DataTypes.TEXT,
    isRead: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'SYS_Notification',
  });
  return SYS_Notification;
};
