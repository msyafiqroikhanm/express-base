'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PAR_Participant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PAR_Participant.belongsTo(models.PAR_ContingentGroup, { foreignKey: 'groupId', as: 'group' });
      PAR_Participant.belongsTo(models.QRM_QR, { foreignKey: 'qrId', as: 'qr' });
      PAR_Participant.belongsTo(models.REF_ParticipantType, { foreignKey: 'typeId', as: 'participantType' });
      PAR_Participant.belongsTo(models.REF_IdentityType, { foreignKey: 'identityTypeId', as: 'identityType' });
    }
  }
  PAR_Participant.init({
    groupId: DataTypes.INTEGER,
    qrId: DataTypes.INTEGER,
    typeId: DataTypes.INTEGER,
    identityTypeId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    gender: DataTypes.BOOLEAN,
    birthDate: DataTypes.DATEONLY,
    identityNo: DataTypes.STRING,
    phoneNbr: DataTypes.STRING,
    email: DataTypes.STRING,
    address: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'PAR_Participant',
    paranoid: true,
  });
  return PAR_Participant;
};
