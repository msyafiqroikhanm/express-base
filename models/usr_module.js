'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class USR_Module extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      USR_Module.belongsTo(models.USR_Module, { foreignKey: 'parentModuleId', as: 'parentModule' });

      USR_Module.hasMany(models.USR_Feature, { foreignKey: 'moduleId' });
      USR_Module.hasMany(models.USR_Module, { foreignKey: 'parentModuleId', as: 'subModule' });
    }
  }
  USR_Module.init({
    parentModuleId: DataTypes.INTEGER,
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'USR_Module',
  });
  return USR_Module;
};
