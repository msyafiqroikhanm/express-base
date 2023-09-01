'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ACM_Locations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // * Self Reference
      ACM_Locations.belongsTo(models.ACM_Locations, {
        foreignKey: 'parentLocationId',
        as: 'parentLocation',
      });
      ACM_Locations.hasMany(models.ACM_Locations, {
        foreignKey: 'parentLocationId',
        as: 'childLocation',
      });

      //* PIC
      ACM_Locations.belongsTo(models.USR_User, {
        foreignKey: 'picId',
        as: 'PIC',
      });

      //* PIC IT
      ACM_Locations.belongsTo(models.USR_User, {
        foreignKey: 'picItId',
        as: 'PIC_IT',
      });

      //* Location Type
      ACM_Locations.belongsTo(models.REF_LocationType, {
        foreignKey: 'typeId',
        as: 'LocationType',
      });
    }
  }
  ACM_Locations.init(
    {
      parentLocationId: DataTypes.INTEGER,
      picId: DataTypes.INTEGER,
      picItId: DataTypes.INTEGER,
      typeId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      address: DataTypes.STRING,
      phoneNbr: DataTypes.STRING,
      latitude: DataTypes.STRING,
      longtitude: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'ACM_Locations',
    },
  );
  return ACM_Locations;
};
