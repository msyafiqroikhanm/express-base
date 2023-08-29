'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class REF_GroupStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      REF_GroupStatus.hasMany(models.PAR_ContingentGroup, { foreignKey: 'statusId', as: 'groups' });
    }
  }
  REF_GroupStatus.init({
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'REF_GroupStatus',
  });
  return REF_GroupStatus;
};
