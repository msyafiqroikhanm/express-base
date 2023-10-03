/* eslint-disable no-unused-vars */

'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FNB_Courier extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FNB_Courier.belongsTo(models.USR_User, { foreignKey: 'userId', as: 'user' });
    }
  }
  FNB_Courier.init(
    {
      userId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      phoneNbr: DataTypes.STRING,
      isAvailable: DataTypes.BOOLEAN,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      paranoid: true,
      deletedAt: 'deletedAt',
      modelName: 'FNB_Courier',
    },
  );
  return FNB_Courier;
};
