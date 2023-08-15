'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class USR_User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  USR_User.init({
    roleId: DataTypes.INTEGER,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNbr: DataTypes.STRING,
    lastLogin: DataTypes.DATE,
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'USR_User',
  });
  return USR_User;
};