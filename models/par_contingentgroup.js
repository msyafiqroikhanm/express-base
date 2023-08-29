'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PAR_ContingentGroup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PAR_ContingentGroup.belongsTo(models.ENV_Event, { foreignKey: 'eventId' });
      PAR_ContingentGroup.belongsTo(models.PAR_Contingent, { foreignKey: 'contingetId' });
      PAR_ContingentGroup.belongsTo(models.REF_GroupStatus, { foreignKey: 'statusId', as: 'status' });

      PAR_ContingentGroup.hasMany(models.PAR_Participant, { foreignKey: 'groupId', as: 'participants' });
    }
  }
  PAR_ContingentGroup.init({
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    contingentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    statusId: DataTypes.INTEGER,
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'PAR_ContingentGroup',
  });
  return PAR_ContingentGroup;
};
