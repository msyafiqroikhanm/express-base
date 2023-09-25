/* eslint-disable no-unused-vars */

'use strict';

const fs = require('fs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    //* ENV_Events
    const env_events = JSON.parse(fs.readFileSync('./seeders/data/env_events.json'));
    const events = env_events.map((element) => ({
      picId: element.picId,
      categoryId: element.categoryId,
      locationId: element.locationId,
      name: element.name,
      minAge: element.minAge,
      maxAge: element.maxAge,
      maxParticipantPerGroup: element.maxParticipantPerGroup,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('ENV_Events', events);

    //* ENV_TimeEvents
    const env_timeevent = JSON.parse(fs.readFileSync('./seeders/data/env_timeevents.json'));
    const timeEvents = env_timeevent.map((element) => ({
      eventId: element.eventId,
      start: new Date(element.start),
      end: new Date(element.end),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('ENV_TimeEvents', timeEvents);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ENV_TimeEvents', null, {
      truncate: true,
      restartIdentity: true,
    });

    await queryInterface.bulkDelete('ENV_Events', null, {
      truncate: true,
      restartIdentity: true,
    });
  },
};
