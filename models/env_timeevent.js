'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ENV_TimeEvent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ENV_TimeEvent.belongsTo(models.ENV_Event, { foreignKey: 'eventId', as: 'event', onDelete: 'CASCADE' });
    }
  }
  ENV_TimeEvent.init({
    eventId: DataTypes.INTEGER,
    start: DataTypes.DATE,
    end: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'ENV_TimeEvent',
  });
  return ENV_TimeEvent;
};
