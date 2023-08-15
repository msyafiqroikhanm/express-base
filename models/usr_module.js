'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class USR_Module extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  USR_Module.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'USR_Module',
  });
  return USR_Module;
};