'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PAR_Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PAR_Group.belongsToMany(models.PAR_Participant, {
        through: 'PAR_GroupMember',
        foreignKey: 'groupId',
        otherKey: 'participantId',
      });

      PAR_Group.belongsTo(models.ENV_Event, { foreignKey: 'eventId' });
      PAR_Group.belongsTo(models.PAR_Contingent, { foreignKey: 'contingetId' });
      PAR_Group.belongsTo(models.REF_GroupStatus, { foreignKey: 'statusId', as: 'status' });

      PAR_Group.hasMany(models.PAR_GroupMember, { foreignKey: 'groupId' });
    }
  }
  PAR_Group.init({
    eventId: {
      type: DataTypes.INTEGER,
    },
    contingentId: {
      type: DataTypes.INTEGER,
    },
    statusId: DataTypes.INTEGER,
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'PAR_Group',
  });
  return PAR_Group;
};
