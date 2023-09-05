'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class REF_PICType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  REF_PICType.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'REF_PICType',
  });
  return REF_PICType;
};