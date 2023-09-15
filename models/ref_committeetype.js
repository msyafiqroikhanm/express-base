'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class REF_CommitteeType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      REF_CommitteeType.hasMany(models.PAR_Participant, { foreignKey: 'committeeTypeId', as: 'committees' });
    }
  }
  REF_CommitteeType.init({
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'REF_CommitteeType',
  });
  return REF_CommitteeType;
};
