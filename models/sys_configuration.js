'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SYS_Configuration extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SYS_Configuration.belongsTo(models.REF_ConfigurationCategory, { foreignKey: 'categoryId' });
    }
  }
  SYS_Configuration.init({
    categoryId: DataTypes.INTEGER,
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'SYS_Configuration',
  });
  return SYS_Configuration;
};
