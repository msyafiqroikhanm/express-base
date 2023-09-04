'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class REF_FAQType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      REF_FAQType.hasMany(models.CSM_FAQ, { foreignKey: 'typeId', as: 'FAQs' });
    }
  }
  REF_FAQType.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'REF_FAQType',
  });
  return REF_FAQType;
};
