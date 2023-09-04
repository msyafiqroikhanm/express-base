'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class REF_InformationCenterTargetType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      REF_InformationCenterTargetType.belongsToMany(models.CSM_InformationCenter, {
        through: 'CSM_InformationCenterTarget',
        foreignKey: 'informationCenterId',
        otherKey: 'targetId',
      });

      REF_InformationCenterTargetType.hasMany(models.CSM_InformationCenterTarget, { foreignKey: 'targetId' });
    }
  }
  REF_InformationCenterTargetType.init({
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'REF_InformationCenterTargetType',
  });
  return REF_InformationCenterTargetType;
};
