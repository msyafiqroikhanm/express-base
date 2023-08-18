/* eslint-disable lines-around-directive */
'use strict';
const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class USR_RoleFeature extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      USR_RoleFeature.belongsTo(models.USR_Role, { foreignKey: 'roleId' });
      USR_RoleFeature.belongsTo(models.USR_Feature, { foreignKey: 'featureId' });
    }
  }
  USR_RoleFeature.init({
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    featureId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
  }, {
    sequelize,
    modelName: 'USR_RoleFeature',
  });
  return USR_RoleFeature;
};
