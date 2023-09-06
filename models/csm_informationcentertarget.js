'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CSM_InformationCenterTarget extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CSM_InformationCenterTarget.belongsTo(models.CSM_InformationCenter, { foreignKey: 'informationCenterId' });
      CSM_InformationCenterTarget.belongsTo(models.REF_ParticipantType, { foreignKey: 'participantTypeId' });
    }
  }
  CSM_InformationCenterTarget.init({
    informationCenterId: DataTypes.INTEGER,
    participantTypeId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'CSM_InformationCenterTarget',
  });
  return CSM_InformationCenterTarget;
};
