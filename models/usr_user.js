/* eslint-disable comma-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable lines-around-directive */
'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class USR_User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      USR_User.belongsToMany(models.REF_PICType, {
        through: 'USR_PIC',
        foreignKey: 'userId',
        otherKey: 'typeId',
      });

      USR_User.belongsTo(models.USR_Role, { foreignKey: 'roleId', as: 'Role' });
      USR_User.belongsTo(models.QRM_QR, { foreignKey: 'qrId', as: 'Qr' });
      USR_User.belongsTo(models.PAR_Participant, { foreignKey: 'participantId', as: 'participant' });

      USR_User.hasMany(models.ENV_Event, { foreignKey: 'picId', as: 'pic' });
      USR_User.hasMany(models.USR_PIC, { foreignKey: 'userId', as: 'PIC' });
    }
  }
  USR_User.init(
    {
      qrId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      participantId: DataTypes.INTEGER,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      email: DataTypes.STRING,
      lastLogin: DataTypes.DATE,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'USR_User',
      paranoid: true,
    }
  );

  // Add hook to hash password before saving (create) to database
  USR_User.beforeCreate(async (users) => {
    const salt = await bcrypt.genSalt(10);
    users.password = await bcrypt.hash(users.password, salt);
  });

  // Add hook to hash password before updating to database
  USR_User.beforeUpdate(async (users) => {
    if (users.changed('password')) {
      const salt = await bcrypt.genSalt(10);
      users.password = await bcrypt.hash(users.password, salt);
    }
  });
  return USR_User;
};
