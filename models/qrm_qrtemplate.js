'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class QRM_QRTemplate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      QRM_QRTemplate.hasMany(models.QRM_QR, { foreignKey: 'templateId', as: 'Template' });
    }
  }
  QRM_QRTemplate.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'QRM_QRTemplate',
  });
  return QRM_QRTemplate;
};
