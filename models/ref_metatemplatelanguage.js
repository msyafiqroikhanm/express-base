'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class REF_MetaTemplateLanguage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      REF_MetaTemplateLanguage.hasMany(models.CSM_BroadcastTemplate, { foreignKey: 'languageId', as: 'templates' });
    }
  }
  REF_MetaTemplateLanguage.init({
    name: DataTypes.STRING,
    value: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'REF_MetaTemplateLanguage',
  });
  return REF_MetaTemplateLanguage;
};
