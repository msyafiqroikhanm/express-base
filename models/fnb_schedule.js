'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FNB_Schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FNB_Schedule.init({
    picLocationId: DataTypes.INTEGER,
    picKitchenId: DataTypes.INTEGER,
    qrId: DataTypes.INTEGER,
    locationId: DataTypes.INTEGER,
    kitchenId: DataTypes.INTEGER,
    statusId: DataTypes.INTEGER,
    courierId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    pickUpTime: DataTypes.DATE,
    dropOfTime: DataTypes.DATE,
    vehiclePlateNo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'FNB_Schedule',
  });
  return FNB_Schedule;
};