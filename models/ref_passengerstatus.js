'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class REF_PassengerStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      REF_PassengerStatus.hasMany(models.TPT_SchedulePassenger, { foreignKey: 'statusId', as: 'passengers' });
    }
  }
  REF_PassengerStatus.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'REF_PassengerStatus',
  });
  return REF_PassengerStatus;
};
