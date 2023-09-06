'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class REF_ParticipantType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      REF_ParticipantType.belongsToMany(models.CSM_InformationCenter, {
        through: 'CSM_InformationCenterTarget',
        foreignKey: 'participantTypeId',
        otherKey: 'informationCenterId',
      });

      REF_ParticipantType.hasMany(models.PAR_Participant, { foreignKey: 'typeId', as: 'users' });
      REF_ParticipantType.hasMany(models.CSM_InformationCenterTarget, { foreignKey: 'participantTypeId' });
    }
  }
  REF_ParticipantType.init({
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'REF_ParticipantType',
  });
  return REF_ParticipantType;
};
