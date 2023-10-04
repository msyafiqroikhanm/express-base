/* eslint-disable no-unused-vars */

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('FNB_ScheduleMenus', 'menuId', 'kitchenTargetId');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('FNB_ScheduleMenus', 'kitchenTargetId', 'menuId');
  },
};
