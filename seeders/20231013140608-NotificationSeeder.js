/* eslint-disable no-unused-vars */

'use strict';

const fs = require('fs');
const { USR_Role } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    //* SYS_NotificationTypes
    const sys_notification_types = JSON.parse(
      fs.readFileSync('./seeders/data/sys_notification_types.json'),
    );
    const notificationTypes = sys_notification_types.map((element) => ({
      name: element.name,
      url: element.url,
      relatedTable: element.relatedTable,
      messageFormat: element.messageFormat,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('SYS_NotificationTypes', notificationTypes);

    //* SYS_RoleNotificationSubscriptions
    const notificationSubs = JSON.parse(
      fs.readFileSync('./seeders/data/sys_rolenotificationsubscriptions.json'),
    );
    const notifications = [];
    await Promise.all(notificationSubs.map(async (element) => {
      const roleInstance = await USR_Role.findOne({ where: { name: element.role } });
      if (roleInstance) {
        element.subscriptions.forEach((notification) => {
          notifications.push({
            roleId: roleInstance.id,
            typeId: notification.typeId,
            limitation: notification.limitation,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        });
      }
    }));
    await queryInterface.bulkInsert('SYS_RoleNotificationSubscriptions', notifications);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('SYS_RoleNotificationSubscriptions', null, {
      truncate: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete('SYS_NotificationTypes', null, {
      truncate: true,
      restartIdentity: true,
    });
  },
};
