'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ACM_Location extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // * Self Reference
      ACM_Location.belongsTo(models.ACM_Location, {
        foreignKey: 'parentLocationId',
        as: 'parentLocation',
      });
      ACM_Location.hasMany(models.ACM_Location, {
        foreignKey: 'parentLocationId',
        as: 'childLocation',
      });

      //* PIC
      ACM_Location.belongsTo(models.USR_PIC, {
        foreignKey: 'picId',
        as: 'pic',
      });

      //* Location Type
      ACM_Location.belongsTo(models.REF_LocationType, {
        foreignKey: 'typeId',
        as: 'type',
      });

      // * Event
      ACM_Location.hasMany(models.ENV_Event, { foreignKey: 'locationId', as: 'events' });

      // * Room
      ACM_Location.hasMany(models.ACM_Room, { foreignKey: 'locationId', as: 'rooms' });

      // * Facility
      ACM_Location.hasMany(models.ACM_Facility, { foreignKey: 'locationId', as: 'facilities' });

      // ACM_Location.belongsTo(models.USR_PIC, {
      //   foreignKey: 'picId',
      //   as: 'pic',
      // });
    }
  }
  ACM_Location.init(
    {
      parentLocationId: DataTypes.INTEGER,
      picId: DataTypes.INTEGER,
      typeId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      address: DataTypes.STRING,
      phoneNbr: DataTypes.STRING,
      latitude: DataTypes.STRING,
      longtitude: DataTypes.STRING,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      paranoid: true,
      deletedAt: 'deletedAt',
      modelName: 'ACM_Location',
    },
  );
  return ACM_Location;
};
