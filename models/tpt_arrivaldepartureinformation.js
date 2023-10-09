'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TPT_ArrivalDepartureInformation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TPT_ArrivalDepartureInformation.belongsTo(models.PAR_Contingent, { foreignKey: 'contingentId', as: 'contingent' });
      TPT_ArrivalDepartureInformation.belongsTo(models.ACM_Location, { foreignKey: 'locationId', as: 'location' });
    }
  }
  TPT_ArrivalDepartureInformation.init({
    contingentId: DataTypes.INTEGER,
    locationId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    type: {
      type: DataTypes.ENUM,
      values: ['Arrival', 'Departure'],
    },
    transportation: DataTypes.TEXT,
    otherLocation: DataTypes.TEXT,
    totalParticipant: DataTypes.INTEGER,
    time: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'TPT_ArrivalDepartureInformation',
  });
  return TPT_ArrivalDepartureInformation;
};
