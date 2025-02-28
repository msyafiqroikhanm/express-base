'use strict';

const { Model } = require('sequelize');

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

      PAR_Participant.belongsToMany(models.CSM_Broadcast, {
        through: 'CSM_BroadcastParticipant',
        foreignKey: 'participantId',
        otherKey: 'broadcastId',
      });

      PAR_Participant.belongsToMany(models.TPT_VehicleSchedule, {
        through: 'TPT_SchedulePassenger',
        foreignKey: 'participantId',
        otherKey: 'vehicleScheduleId',
      });

      PAR_Participant.belongsTo(models.PAR_Contingent, {
        foreignKey: 'contingentId',
        as: 'contingent',
      });
      PAR_Participant.belongsTo(models.QRM_QR, { foreignKey: 'qrId', as: 'qr' });
      PAR_Participant.belongsTo(models.REF_ParticipantType, {
        foreignKey: 'typeId',
        as: 'participantType',
      });
      PAR_Participant.belongsTo(models.REF_IdentityType, {
        foreignKey: 'identityTypeId',
        as: 'identityType',
      });
      PAR_Participant.belongsTo(models.REF_CommitteeType, { foreignKey: 'committeeTypeId', as: 'committeeType' });

      PAR_Participant.hasMany(models.PAR_GroupMember, { foreignKey: 'participantId' });
      PAR_Participant.hasMany(models.CSM_BroadcastParticipant, { foreignKey: 'participantId' });
      PAR_Participant.hasMany(models.TPT_SchedulePassenger, { foreignKey: 'participantId' });
      PAR_Participant.hasMany(models.ACM_ParticipantLodger, { foreignKey: 'participantId', as: 'lodgers' });

      PAR_Participant.hasOne(models.PAR_ParticipantTracking, { foreignKey: 'participantId', as: 'tracking' });
      PAR_Participant.hasOne(models.USR_User, { foreignKey: 'participantId', as: 'user' });
    }
  }
  PAR_Participant.init(
    {
      contingentId: DataTypes.INTEGER,
      qrId: DataTypes.INTEGER,
      typeId: DataTypes.INTEGER,
      committeeTypeId: DataTypes.INTEGER,
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
      identityFile: DataTypes.STRING,
      baptismFile: DataTypes.STRING,
      referenceFile: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'PAR_Participant',
      paranoid: true,
    },
  );
  return PAR_Participant;
};
