'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CSM_FAQ extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CSM_FAQ.belongsTo(models.CSM_FAQ, { foreignKey: 'parentFAQId', as: 'parentFAQ' });
      CSM_FAQ.belongsTo(models.REF_FAQType, { foreignKey: 'typeId', as: 'type' });

      CSM_FAQ.hasMany(models.CSM_FAQ, { foreignKey: 'parentFAQId', as: 'childFAQs' });
    }
  }
  CSM_FAQ.init({
    parentFAQId: DataTypes.INTEGER,
    typeId: DataTypes.INTEGER,
    isMain: DataTypes.BOOLEAN,
    title: DataTypes.STRING,
    message: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'CSM_FAQ',
  });
  return CSM_FAQ;
};
