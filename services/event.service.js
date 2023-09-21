/* eslint-disable no-param-reassign */
const { Op } = require('sequelize');
const {
  ENV_Event, ENV_TimeEvent, REF_EventCategory, USR_PIC, ACM_Location, USR_User, PAR_Participant,
  REF_GroupStatus, PAR_Group, PAR_Contingent,
} = require('../models');

const selectAllEvents = async (where) => {
  const data = await ENV_Event.findAll({
    where: where.picId ? { id: { [Op.in]: where.events } } : null,
    include: [
      { model: REF_EventCategory, attributes: ['name'], as: 'category' },
      { model: ACM_Location, as: 'location', attributes: { exclude: ['id', 'deletedAt', 'createdAt', 'updatedAt'] } },
      { model: ENV_TimeEvent, attributes: ['id', 'start', 'end'], as: 'schedules' },
      // {
      //   model: USR_PIC,
      //   as: 'pic',
      // },
    ],
  });

  await Promise.all(data.map(async (event) => {
    event.dataValues.category = event.category.dataValues.name;
    const pic = await USR_PIC.findOne({
      where: { id: event.picId },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: {
        model: USR_User,
        as: 'user',
        attributes: ['id'],
        include: { model: PAR_Participant, as: 'participant', attributes: ['name', 'phoneNbr', 'email'] },
      },
    });

    event.dataValues.pic = pic?.user?.participant || null;
  }));

  return {
    success: true, message: 'Succesfully Getting All Events', content: data,
  };
};

const selectEvent = async (id, where = {}) => {
  if (where.picId && !where.events.includes(Number(id))) {
    return { success: false, code: 404, message: ['Event Data Not Found'] };
  }
  // check event id validity
  const eventInstance = await ENV_Event.findOne({
    include: [
      { model: REF_EventCategory, attributes: ['name'], as: 'category' },
      { model: ENV_TimeEvent, attributes: ['start', 'end'], as: 'schedules' },
      { model: ACM_Location, as: 'location', attributes: { exclude: ['id', 'deletedAt', 'createdAt', 'updatedAt'] } },
    ],
  });
  if (!eventInstance) {
    return { success: false, code: 404, message: ['Event Data Not Found'] };
  }

  const pic = await USR_PIC.findByPk(eventInstance.picId, {
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    include: {
      model: USR_User,
      as: 'user',
      attributes: ['id'],
      include: { model: PAR_Participant, as: 'participant', attributes: ['name', 'phoneNbr', 'email'] },
    },
  });

  eventInstance.dataValues.pic = pic.user?.participant;
  eventInstance.dataValues.category = eventInstance.category?.dataValues.name;

  return {
    success: true, message: 'Success Getting Event', content: eventInstance,
  };
};

const validateEventInputs = async (form) => {
  const {
    picId, categoryId, locationId, name, schedules,
  } = form;

  const invalid400 = [];
  const invalid404 = [];

  const picInstance = await USR_PIC.findOne({ where: { id: picId } });
  if (!picInstance) {
    invalid404.push('PIC / User Data Not Found');
  }

  const categoryInstance = await REF_EventCategory.findByPk(categoryId);
  if (!categoryInstance) {
    invalid404.push('Event Category Data Not Found');
  }

  const locationInstance = await ACM_Location.findByPk(locationId);
  if (!locationInstance) {
    invalid404.push('Location Data Not Found');
  }

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
    invalid400.push('End must be set after Start');
  }

  if (invalid400.length > 0) {
    return {
      isValid: false,
      code: 400,
      message: invalid400,
    };
  }
  if (invalid404.length > 0) {
    return {
      isValid: false,
      code: 404,
      message: invalid404,
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

  eventInstance.picId = picId || eventInstance.picId;
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

const deleteEvent = async (id, where) => {
  if (where.picId && !where.events.includes(Number(id))) {
    return { success: false, code: 404, message: ['Event Data Not Found'] };
  }

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

const selectAllGroupOfEvent = async (id, where) => {
  if (where.picId && !where.events.includes(Number(id))) {
    return { success: false, code: 404, message: ['Event Data Not Found'] };
  }

  const eventInstance = await ENV_Event.findOne({
    where: { id },
    attributes: ['id'],
    include: {
      model: PAR_Group,
      attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      include: [
        { model: PAR_Contingent, attributes: ['name'], as: 'contingent' },
        { model: REF_GroupStatus, attributes: ['name'], as: 'status' },
      ],
    },
  });
  if (!eventInstance) {
    return { success: false, code: 404, message: ['Event Data Not Found'] };
  }

  return {
    success: true,
    message: 'Successfully Getting All Group Related To Event',
    content: eventInstance?.PAR_Groups || [],
  };
};

const updateProgressGroup = async (form, id, where) => {
  if (where.picId && !where.events.includes(Number(id))) {
    return { success: false, code: 404, message: ['Event Data Not Found'] };
  }

  const invalid400 = [];
  const invalid404 = [];

  const groupInstance = await PAR_Group.findOne({
    where: { id: form.groupId, eventId: id },
  });
  if (!groupInstance) {
    return { success: false, code: 404, message: ['Group Data Not Found'] };
  }

  const statusInstance = await REF_GroupStatus.findByPk(form.statusId);
  if (!statusInstance) {
    return { success: false, code: 404, message: ['Group Status Data Not Found'] };
  }

  if (invalid400.length > 0) {
    return {
      isValid: false,
      code: 400,
      message: invalid400,
    };
  }
  if (invalid404.length > 0) {
    return {
      isValid: false,
      code: 404,
      message: invalid404,
    };
  }

  groupInstance.statusId = statusInstance.id;
  await groupInstance.save();

  return {
    success: true,
    message: 'Group Status Successufully Updated / Progress',
    content: groupInstance,
  };
};

module.exports = {
  selectAllEvents,
  selectEvent,
  validateEventInputs,
  createEvent,
  updateEvent,
  deleteEvent,
  updateProgressGroup,
  selectAllGroupOfEvent,
};
