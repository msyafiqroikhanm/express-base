'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ACM_Facility extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ACM_Facility.belongsTo(models.ACM_Location, {
        foreignKey: 'locationId',
        as: 'location',
      });
    }
  }
  ACM_Facility.init(
    {
      locationId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      paranoid: true,
      deletedAt: 'deletedAt',
      modelName: 'ACM_Facility',
    },
  );
  return ACM_Facility;
};
