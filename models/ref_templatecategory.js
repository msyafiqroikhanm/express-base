'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class REF_TemplateCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      REF_TemplateCategory.hasMany(models.CSM_BroadcastTemplate, { foreignKey: 'categoryId', as: 'templates' });
    }
  }
  REF_TemplateCategory.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'REF_TemplateCategory',
  });
  return REF_TemplateCategory;
};
