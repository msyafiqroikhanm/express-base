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
      QRM_QR.belongsTo(models.QRM_QRTemplate, { foreignKey: 'templateId', as: 'Template' });

      QRM_QR.hasOne(models.USR_User, { foreignKey: 'qrId', as: 'Qr' });
    }
  }
  QRM_QR.init({
    templateId: {
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
