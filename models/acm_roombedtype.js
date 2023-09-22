'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ACM_RoomBedType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ACM_RoomBedType.init(
    {
      locationId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      paranoid: true,
      deletedAt: 'deletedAt',
      modelName: 'ACM_RoomBedType',
    },
  );
  return ACM_RoomBedType;
};
