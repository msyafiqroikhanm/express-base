'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class USR_Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      USR_Role.belongsToMany(models.USR_Feature, {
        through: 'USR_RoleFeature',
        foreignKey: 'roleId',
        otherKey: 'featureId',
      });

      USR_Role.belongsTo(models.QRM_QRTemplate, { foreignKey: 'templateId', as: 'template' });

      USR_Role.hasMany(models.USR_RoleFeature, { foreignKey: 'roleId' });
      USR_Role.hasMany(models.USR_User, { foreignKey: 'roleId' });
    }
  }
  USR_Role.init({
    templateId: DataTypes.INTEGER,
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'USR_Role',
  });
  return USR_Role;
};
