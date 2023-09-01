'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CSM_BroadcastCommittee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CSM_BroadcastCommittee.belongsTo(models.USR_Role, { foreignKey: 'roleId' });
      CSM_BroadcastCommittee.belongsTo(models.CSM_Broadcast, { foreignKey: 'broadcastId' });
    }
  }
  CSM_BroadcastCommittee.init({
    roleId: DataTypes.INTEGER,
    broadcastId: DataTypes.INTEGER,
    status: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'CSM_BroadcastCommittee',
  });
  return CSM_BroadcastCommittee;
};
