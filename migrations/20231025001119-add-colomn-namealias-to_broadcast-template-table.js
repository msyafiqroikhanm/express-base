'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('CSM_BroadcastTemplates', 'nameAlias', {
      type: Sequelize.STRING,
      after: 'name',
      defaultValue: '',
    });
  },

  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('CSM_BroadcastTemplates', 'nameAlias');
  },
};
