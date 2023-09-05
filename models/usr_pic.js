'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class USR_PIC extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  USR_PIC.init({
    userId: DataTypes.INTEGER,
    typeId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'USR_PIC',
  });
  return USR_PIC;
};