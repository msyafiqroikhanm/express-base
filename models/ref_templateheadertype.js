'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class REF_TemplateHeaderType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      REF_TemplateHeaderType.hasMany(models.CSM_BroadcastTemplate, { foreignKey: 'headerTypeId', as: 'templates' });
    }
  }
  REF_TemplateHeaderType.init({
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'REF_TemplateHeaderType',
  });
  return REF_TemplateHeaderType;
};
