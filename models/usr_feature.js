'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class USR_Feature extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      USR_Feature.belongsToMany(models.USR_Role, {
        through: 'USR_RoleFeature',
        foreignKey: 'featureId',
        otherKey: 'roleId',
      });

      USR_Feature.hasMany(models.USR_RoleFeature, { foreignKey: 'featureId' });

      USR_Feature.belongsTo(models.USR_Module, { foreignKey: 'moduleId' });
    }
  }
  USR_Feature.init({
    moduleId: DataTypes.INTEGER,
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'USR_Feature',
  });
  return USR_Feature;
};
