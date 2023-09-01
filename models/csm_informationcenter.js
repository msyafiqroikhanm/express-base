'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CSM_InformationCenter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CSM_InformationCenter.belongsToMany(models.REF_InformationCenterTargetType, {
        through: 'CSM_InformationCenterTarget',
        foreignKey: 'informationCenterId',
        otherKey: 'targetId',
      });

      CSM_InformationCenter.hasMany(models.CSM_InformationCenterTarget, { foreignKey: 'informationCenterId' });
    }
  }
  CSM_InformationCenter.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'CSM_InformationCenter',
  });
  return CSM_InformationCenter;
};
