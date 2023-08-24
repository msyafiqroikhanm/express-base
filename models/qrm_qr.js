'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class QRM_QR extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      QRM_QR.belongsTo(models.REF_QRType, { foreignKey: 'typeId', as: 'Type' });
      QRM_QR.belongsTo(models.QRM_QRTemplate, { foreignKey: 'templateId', as: 'Template' });
    }
  }
  QRM_QR.init({
    templateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    typeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    code: DataTypes.STRING,
    rawFile: DataTypes.STRING,
    combineFile: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'QRM_QR',
  });
  return QRM_QR;
};
