'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('USR_Modules', [
      {
        name: 'Access Management',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('USR_Modules', null, {
      truncate: true,
      restartIdentity: true,
    });
  },
};
