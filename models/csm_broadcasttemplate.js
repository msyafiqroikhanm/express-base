'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CSM_BroadcastTemplate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CSM_BroadcastTemplate.belongsTo(models.REF_TemplateCategory, { foreignKey: 'categoryId', as: 'category' });
      CSM_BroadcastTemplate.belongsTo(models.REF_MetaTemplateCategory, { foreignKey: 'metaCategoryId', as: 'metaCategory' });
      CSM_BroadcastTemplate.belongsTo(models.REF_TemplateHeaderType, { foreignKey: 'headerTypeId', as: 'headerType' });

      CSM_BroadcastTemplate.hasMany(models.CSM_Broadcast, { foreignKey: 'templateId', as: 'broadcasts' });
    }
  }
  CSM_BroadcastTemplate.init({
    categoryId: DataTypes.INTEGER,
    metaCategoryId: DataTypes.INTEGER,
    headerTypeId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    language: DataTypes.STRING,
    message: DataTypes.TEXT,
    messageVariableNumber: DataTypes.INTEGER,
    messageVariableExample: DataTypes.JSON,
    headerText: DataTypes.STRING,
    haveHeaderVariable: DataTypes.BOOLEAN,
    headerVariableExample: DataTypes.STRING,
    headerFile: DataTypes.STRING,
    footer: DataTypes.STRING,
    button: DataTypes.JSON,
    metaStatus: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'CSM_BroadcastTemplate',
  });
  return CSM_BroadcastTemplate;
};
