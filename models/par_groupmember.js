'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PAR_GroupMember extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PAR_GroupMember.belongsTo(models.PAR_Group, { foreignKey: 'groupId' });
      PAR_GroupMember.belongsTo(models.PAR_Participant, { foreignKey: 'participantId' });
    }
  }
  PAR_GroupMember.init({
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    participantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
  }, {
    sequelize,
    modelName: 'PAR_GroupMember',
  });
  return PAR_GroupMember;
};
