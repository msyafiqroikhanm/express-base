'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PAR_Contingent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PAR_Contingent.belongsToMany(models.ENV_Event, {
        through: 'PAR_ContingentGroup',
        foreignKey: 'contingentId',
        otherKey: 'eventId',
      });

      PAR_Contingent.belongsTo(models.REF_Region, { foreignKey: 'regionId', as: 'region' });

      PAR_Contingent.hasMany(models.PAR_ContingentGroup, { foreignKey: 'contingentId' });
    }
  }
  PAR_Contingent.init({
    regionId: DataTypes.INTEGER,
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'PAR_Contingent',
  });
  return PAR_Contingent;
};
