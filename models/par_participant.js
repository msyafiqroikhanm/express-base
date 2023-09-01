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
      PAR_Participant.belongsToMany(models.PAR_Group, {
        through: 'PAR_GroupMember',
        foreignKey: 'participantId',
        otherKey: 'groupId',
        as: 'groups',
      });

      PAR_Participant.belongsTo(models.PAR_Contingent, { foreignKey: 'contingentId', as: 'contingent' });
      PAR_Participant.belongsTo(models.QRM_QR, { foreignKey: 'qrId', as: 'qr' });
      PAR_Participant.belongsTo(models.REF_ParticipantType, { foreignKey: 'typeId', as: 'participantType' });
      PAR_Participant.belongsTo(models.REF_IdentityType, { foreignKey: 'identityTypeId', as: 'identityType' });

      PAR_Participant.hasMany(models.PAR_GroupMember, { foreignKey: 'participantId' });
      PAR_Participant.hasMany(models.PAR_ParticipantTracking, { foreignKey: 'participantId', as: 'history' });
    }
  }
  PAR_Participant.init({
    contingentId: DataTypes.INTEGER,
    qrId: DataTypes.INTEGER,
    typeId: DataTypes.INTEGER,
    identityTypeId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    gender: {
      type: DataTypes.ENUM,
      values: ['Female', 'Male'],
    },
    birthDate: DataTypes.DATEONLY,
    identityNo: DataTypes.STRING,
    phoneNbr: DataTypes.STRING,
    email: DataTypes.STRING,
    address: DataTypes.TEXT,
    file: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'PAR_Participant',
    paranoid: true,
  });
  return PAR_Participant;
};
