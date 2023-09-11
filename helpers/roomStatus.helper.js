const slugify = require('slugify');
const { REF_LodgerStatus } = require('../models');

const roomStatusHelper = async () => {
  const roomStatuses = await REF_LodgerStatus.findAll({ attributes: ['id', 'name'] });

  const roomStatusObject = {};
  roomStatuses.forEach((roomStatus) => {
    roomStatusObject[
      `${slugify(roomStatus.name, {
        replacement: '_',
        lower: true,
        strict: true,
      })}`
    ] = roomStatus.id;
  });

  return roomStatusObject;
};

module.exports = roomStatusHelper;
