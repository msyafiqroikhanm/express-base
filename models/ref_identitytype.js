'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class REF_IdentityType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      REF_IdentityType.hasMany(models.PAR_Participant, { foreignKey: 'identityTypeId', as: 'users' });
    }
  }
  REF_IdentityType.init({
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'REF_IdentityType',
  });
  return REF_IdentityType;
};
