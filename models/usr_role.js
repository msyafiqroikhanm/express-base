'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class USR_Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  USR_Role.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'USR_Role',
  });
  return USR_Role;
};