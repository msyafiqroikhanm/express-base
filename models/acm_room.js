'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ACM_Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ACM_Room.belongsTo(models.ACM_Location, {
        foreignKey: 'locationId',
        as: 'Hotel',
      });
      ACM_Room.belongsTo(models.REF_RoomType, {
        foreignKey: 'typeId',
        as: 'RoomType',
      });
      ACM_Room.belongsTo(models.REF_RoomType, {
        foreignKey: 'statusId',
        as: 'RoomStatus',
      });
    }
  }
  ACM_Room.init(
    {
      locationId: DataTypes.INTEGER,
      typeId: DataTypes.INTEGER,
      statusId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      floor: DataTypes.STRING,
      capacity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'ACM_Room',
    },
  );
  return ACM_Room;
};
