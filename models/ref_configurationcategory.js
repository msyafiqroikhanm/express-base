'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class REF_ConfigurationCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      REF_ConfigurationCategory.hasMany(models.SYS_Configuration, { foreignKey: 'categoryId' });
    }
  }
  REF_ConfigurationCategory.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'REF_ConfigurationCategory',
  });
  return REF_ConfigurationCategory;
};
