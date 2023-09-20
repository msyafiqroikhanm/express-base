'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class REF_RoomType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      REF_RoomType.belongsTo(models.ACM_Location, { foreignKey: 'locationId', as: 'location' });
    }
  }
  REF_RoomType.init(
    {
      locationId: DataTypes.INTEGER,
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      paranoid: true,
      deletedAt: 'deletedAt',
      modelName: 'REF_RoomType',
    },
  );
  return REF_RoomType;
};
