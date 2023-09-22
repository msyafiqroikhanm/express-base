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
        as: 'location',
      });
      ACM_Room.belongsTo(models.REF_RoomType, {
        foreignKey: 'typeId',
        as: 'type',
      });
      ACM_Room.belongsTo(models.REF_RoomStatus, {
        foreignKey: 'statusId',
        as: 'status',
      });
      ACM_Room.belongsTo(models.ACM_RoomBedType, {
        foreignKey: 'bedId',
        as: 'bed',
      });
    }
  }
  ACM_Room.init(
    {
      locationId: DataTypes.INTEGER,
      typeId: DataTypes.INTEGER,
      bedId: DataTypes.INTEGER,
      statusId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      floor: DataTypes.STRING,
      capacity: DataTypes.INTEGER,
      occupied: DataTypes.INTEGER,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      paranoid: true,
      deletedAt: 'deletedAt',
      modelName: 'ACM_Room',
    },
  );
  return ACM_Room;
};
