const slugify = require('slugify');
const { REF_FoodScheduleStatus } = require('../models');

const foodScheduleStatusHelper = async () => {
  const foodScheduleStatuses = await REF_FoodScheduleStatus.findAll({ attributes: ['id', 'name'] });

  const foodScheduleStatusObject = {};
  foodScheduleStatuses.forEach((roomStatus) => {
    foodScheduleStatusObject[
      `${slugify(roomStatus.name, {
        replacement: '_',
        lower: true,
        strict: true,
      })}`
    ] = roomStatus.id;
  });

  return foodScheduleStatusObject;
};

module.exports = foodScheduleStatusHelper;
