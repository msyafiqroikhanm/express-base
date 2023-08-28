'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class REF_EventCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      REF_EventCategory.hasMany(models.ENV_Event, { foreignKey: 'categoryId', as: 'category' });
    }
  }
  REF_EventCategory.init({
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'REF_EventCategory',
  });
  return REF_EventCategory;
};
