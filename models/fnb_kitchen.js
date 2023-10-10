/* eslint-disable no-unused-vars */

'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FNB_Kitchen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FNB_Kitchen.init(
    {
      picId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      productionCapacity: DataTypes.INTEGER,
      phoneNbr: DataTypes.STRING,
      longtitude: DataTypes.STRING,
      latitude: DataTypes.STRING,
      address: DataTypes.TEXT,
    },
    {
      sequelize,
      paranoid: true,
      deletedAt: 'deletedAt',
      modelName: 'FNB_Kitchen',
    },
  );
  return FNB_Kitchen;
};
