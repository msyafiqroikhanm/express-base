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
        as: 'PIC',
      });

      //* PIC IT
      ACM_Location.belongsTo(models.USR_User, {
        foreignKey: 'picItId',
        as: 'PIC_IT',
      });

      //* Location Type
      ACM_Location.belongsTo(models.REF_LocationType, {
        foreignKey: 'typeId',
        as: 'LocationType',
      });
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
    },
    {
      sequelize,
      modelName: 'ACM_Location',
    },
  );
  return ACM_Location;
};
