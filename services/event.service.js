/* eslint-disable no-param-reassign */
const {
  ENV_Event, ENV_TimeEvent, REF_EventCategory, USR_User,
} = require('../models');

const selectAllEvents = async () => {
  const data = await ENV_Event.findAll({
    include: [
      { model: USR_User, attributes: ['name'], as: 'pic' },
      { model: REF_EventCategory, attributes: ['name'], as: 'category' },
      { model: ENV_TimeEvent, attributes: ['id', 'start', 'end'], as: 'schedules' },
    ],
  });

  data.forEach((event) => {
    event.dataValues.pic = event.pic.dataValues.name;
    event.dataValues.category = event.category.dataValues.name;
  });

  return {
    success: true, message: 'Succesfully Getting All Events', content: data,
  };
};

const selectEvent = async (id) => {
  // check event id validity
  const eventInstance = await ENV_Event.findByPk(id, {
    include: [
      { model: USR_User, attributes: ['name'], as: 'pic' },
      { model: REF_EventCategory, attributes: ['name'], as: 'category' },
      { model: ENV_TimeEvent, attributes: ['start', 'end'], as: 'schedules' },
    ],
  });
  if (!eventInstance) {
    return { success: false, code: 404, message: 'Event Data Not Found' };
  }

  eventInstance.dataValues.pic = eventInstance.pic.dataValues.name;
  eventInstance.dataValues.category = eventInstance.category.dataValues.name;

  return {
    success: true, message: 'Success Getting Event', content: eventInstance,
  };
};

const validateEventInputs = async (form) => {
  const {
    picId, categoryId, locationId, name, schedules,
  } = form;

  const userInstance = await USR_User.findByPk(picId);
  if (!userInstance) {
    return {
      isValid: false, code: 404, message: 'PIC / User Data Not Found',
    };
  }

  const categoryInstance = await REF_EventCategory.findByPk(categoryId);
  if (!categoryInstance) {
    return {
      isValid: false, code: 404, message: 'Event Category Data Not Found',
    };
  }

  // todo check location id validity

  // check backdate on time
  const parsedTimes = [];
  const isbackdate = schedules?.some(((time) => {
    if (time.end && new Date(time.start).getTime() > new Date(time.end).getTime()) {
      return true;
    }
    parsedTimes.push({
      start: new Date(time.start),
      end: new Date(time.end),
    });
    return false;
  }));
  if (isbackdate) {
    return {
      isValid: false, code: 400, message: 'End must be set after Start',
    };
  }

  return {
    isValid: true,
    form: {
      picId,
      categoryId,
      locationId,
      name,
      times: parsedTimes,
    },
  };
};

const createEvent = async (form) => {
  const {
    picId, categoryId, locationId, name, times,
  } = form;

  const eventInstance = await ENV_Event.create({
    picId, categoryId, locationId, name,
  });

  await times.forEach(async (time) => {
    await ENV_TimeEvent.create({
      eventId: eventInstance.id,
      start: time.start,
      end: time.end,
    });
  });

  return {
    success: true, message: 'Event Successfully Created', content: eventInstance,
  };
};

const updateEvent = async (id, form) => {
  const {
    picId, categoryId, locationId, name, times,
  } = form;

  // check event id validity
  const eventInstance = await ENV_Event.findByPk(id);
  if (!eventInstance) {
    return {
      success: false, code: 404, message: 'Event Data Not Found',
    };
  }

  eventInstance.picId = picId;
  eventInstance.categoryId = categoryId;
  eventInstance.locationId = locationId;
  eventInstance.name = name;
  await eventInstance.save();

  await ENV_TimeEvent.destroy({
    where: { eventId: eventInstance.id },
  });

  times?.forEach(async (time) => {
    await ENV_TimeEvent.create({
      eventId: eventInstance.id,
      start: time.start,
      end: time.end,
    });
  });

  return {
    success: true, message: 'Event Successfully Updated', content: eventInstance,
  };
};

const deleteEvent = async (id) => {
  // check event id validity
  const eventInstance = await ENV_Event.findByPk(id);
  if (!eventInstance) {
    return {
      success: false, code: 404, message: 'Event Data Not Found',
    };
  }

  const { name } = eventInstance.dataValues;

  await eventInstance.destroy();

  await ENV_TimeEvent.destroy({
    where: { eventId: eventInstance.id },
  });

  return {
    success: true,
    message: 'Event Successfully Deleted',
    content: `Event ${name} Successfully Deleted`,
  };
};

module.exports = {
  selectAllEvents,
  selectEvent,
  validateEventInputs,
  createEvent,
  updateEvent,
  deleteEvent,
};
