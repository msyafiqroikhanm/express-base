/* eslint-disable no-unused-vars */

'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ACM_ParticipantLodger extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ACM_ParticipantLodger.belongsTo(models.PAR_Participant, {
        foreignKey: 'participantId',
        as: 'participant',
      });
      ACM_ParticipantLodger.belongsTo(models.REF_LodgerStatus, {
        foreignKey: 'statusId',
        as: 'status',
      });
      ACM_ParticipantLodger.belongsTo(models.ACM_Room, { foreignKey: 'roomId', as: 'room' });
    }
  }
  ACM_ParticipantLodger.init(
    {
      participantId: DataTypes.INTEGER,
      statusId: DataTypes.INTEGER,
      roomId: DataTypes.INTEGER,
      reservationIn: DataTypes.DATEONLY,
      reservationOut: DataTypes.DATEONLY,
      checkIn: DataTypes.DATE,
      checkout: DataTypes.DATE,
    },
    {
      sequelize,
      paranoid: true,
      deletedAt: 'deletedAt',
      modelName: 'ACM_ParticipantLodger',
    },
  );
  return ACM_ParticipantLodger;
};
