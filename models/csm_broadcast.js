'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CSM_Broadcast extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CSM_Broadcast.belongsToMany(models.PAR_Participant, {
        through: 'CSM_BroadcastParticipant',
        foreignKey: 'broadcastId',
        otherKey: 'participantId',
      });

      CSM_Broadcast.belongsToMany(models.USR_Role, {
        through: 'CSM_BroadcastCommittee',
        foreignKey: 'broadcastId',
        otherKey: 'roleId',
      });

      CSM_Broadcast.belongsTo(models.CSM_BroadcastTemplate, { foreignKey: 'templateId', as: 'template' });

      CSM_Broadcast.hasMany(models.CSM_BroadcastParticipant, { foreignKey: 'broadcastId' });
      CSM_Broadcast.hasMany(models.CSM_BroadcastCommittee, { foreignKey: 'broadcastId' });
    }
  }
  CSM_Broadcast.init({
    templateId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    status: DataTypes.STRING,
    sentAt: DataTypes.DATE,
    messageParameters: DataTypes.JSON,
    buttonParameters: DataTypes.JSON,
    headerFile: DataTypes.STRING,
    headerText: DataTypes.STRING,
    description: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'CSM_Broadcast',
  });
  return CSM_Broadcast;
};
