'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CSM_BroadcastParticipant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CSM_BroadcastParticipant.belongsTo(models.PAR_Participant, { foreignKey: 'participantId' });
      CSM_BroadcastParticipant.belongsTo(models.CSM_Broadcast, { foreignKey: 'broadcastId' });
    }
  }
  CSM_BroadcastParticipant.init({
    participantId: DataTypes.INTEGER,
    broadcastId: DataTypes.INTEGER,
    status: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'CSM_BroadcastParticipant',
  });
  return CSM_BroadcastParticipant;
};
