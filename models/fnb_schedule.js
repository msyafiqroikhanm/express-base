'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FNB_Schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FNB_Schedule.belongsTo(models.ACM_Location, { foreignKey: 'locationId', as: 'destination' });
      FNB_Schedule.belongsTo(models.QRM_QR, { foreignKey: 'qrId', as: 'qr' });
      FNB_Schedule.belongsTo(models.FNB_Kitchen, { foreignKey: 'kitchenId', as: 'kitchen' });
      FNB_Schedule.belongsTo(models.REF_FoodScheduleStatus, {
        foreignKey: 'statusId',
        as: 'status',
      });
      FNB_Schedule.belongsTo(models.FNB_Courier, { foreignKey: 'courierId', as: 'courier' });
    }
  }
  FNB_Schedule.init(
    {
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
      vehiclePlateNo: DataTypes.STRING,
    },
    {
      sequelize,
      paranoid: true,
      deletedAt: 'deletedAt',
      modelName: 'FNB_Schedule',
    },
  );
  return FNB_Schedule;
};
