'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ENV_Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ENV_Event.belongsTo(models.REF_EventCategory, { foreignKey: 'categoryId', as: 'category' });
      ENV_Event.belongsTo(models.USR_User, { foreignKey: 'picId', as: 'pic' });

      ENV_Event.hasMany(models.ENV_TimeEvent, { foreignKey: 'eventId', as: 'event' });
    }
  }
  ENV_Event.init({
    picId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
    locationId: DataTypes.INTEGER,
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'ENV_Event',
  });
  return ENV_Event;
};
