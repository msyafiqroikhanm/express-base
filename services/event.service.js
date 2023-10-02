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
      { model: ACM_Location, as: 'location', attributes: { exclude: ['deletedAt', 'createdAt', 'updatedAt'] } },
      { model: ENV_TimeEvent, attributes: ['name', 'id', 'start', 'end'], as: 'schedules' },
      // {
      //   model: USR_PIC,
      //   as: 'pic',
      // },
    ],
  });

  await Promise.all(data.map(async (event) => {
    event.dataValues.category = event.category?.dataValues.name || null;
    const pic = await USR_PIC.findOne({
      where: { id: event.picId },
      attributes: ['id', 'userId', 'typeId'],
      include: {
        model: USR_User,
        as: 'user',
        attributes: ['id'],
        include: { model: PAR_Participant, as: 'participant', attributes: ['name', 'phoneNbr', 'email'] },
      },
    });

    event.dataValues.pic = pic || null;
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
    where: { id },
    include: [
      { model: REF_EventCategory, attributes: ['name'], as: 'category' },
      { model: ACM_Location, as: 'location', attributes: { exclude: ['deletedAt', 'createdAt', 'updatedAt'] } },
      { model: ENV_TimeEvent, attributes: ['name', 'start', 'end'], as: 'schedules' },
    ],
  });
  if (!eventInstance) {
    return { success: false, code: 404, message: ['Event Data Not Found'] };
  }

  const pic = await USR_PIC.findOne({
    where: { id: eventInstance.picId },
    attributes: ['id', 'userId', 'typeId'],
    include: {
      model: USR_User,
      as: 'user',
      attributes: ['id', 'username'],
      include: { model: PAR_Participant, as: 'participant', attributes: ['name', 'phoneNbr', 'email'] },
    },
  });

  eventInstance.dataValues.pic = pic || null;
  eventInstance.dataValues.category = eventInstance.category?.dataValues.name || null;

  return {
    success: true, message: 'Success Getting Event', content: eventInstance,
  };
};

const validateEventInputs = async (form, id, where = {}) => {
  const {
    picId, categoryId, locationId, name, schedules, code, minAge, maxAge,
    maxParticipantPerGroup, maxTotalParticipant,
  } = form;

  const invalid400 = [];
  const invalid404 = [];

  if (minAge && minAge < 0) {
    invalid400.push('Minimum Age Must Be Greater Than 0');
  }

  if (maxAge && maxAge < 0) {
    invalid400.push('Maximum Age Must Be Greater Than 0');
  }

  if (maxParticipantPerGroup && maxParticipantPerGroup < 0) {
    invalid400.push('Maximum Participant Per Group Must Be Greater Than 0');
  }

  if (maxTotalParticipant && maxTotalParticipant < 0) {
    invalid400.push('Maximum Total Participant Must Be Greater Than 0');
  }

  const picInstance = await USR_PIC.findOne({ where: { id: picId }, attributes: ['id', 'typeId'] });
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
      name: time.name,
      start: new Date(time.start),
      end: new Date(time.end),
    });
    return false;
  }));
  if (isbackdate) {
    invalid400.push('End must be set after Start');
  }

  // check if pic is pic event
  if (picInstance.typeId !== 5) {
    invalid400.push('PIC For Event Must Be PIC Event');
  }

  // check duplicate event code
  const isDuplicateCode = await ENV_Event.findOne({
    where: id ? { id: { [Op.ne]: id }, code } : { code },
  });
  if (isDuplicateCode) {
    invalid400.push('Code Event Already Exist / Taken');
  }

  // check min age is always less than max age
  if (maxAge && minAge > maxAge) {
    invalid400.push('Minimum Age Cannot Be Greater Than Maximum Age');
  }

  if (where.picId && where.picId !== Number(picId)) {
    invalid400.push("Can't Create Event For Another PIC As An PIC");
  }

  if (id && where.picId && !where.events?.includes(Number(id))) {
    invalid400.push("Can't Edit Event Belongs To Another PIC");
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
      code,
      minAge,
      maxAge,
      maxParticipantPerGroup,
      maxTotalParticipant,
    },
  };
};

const createEvent = async (form) => {
  const {
    picId, categoryId, locationId, name, times, code, minAge, maxAge,
    maxParticipantPerGroup, maxTotalParticipant,
  } = form;

  const eventInstance = await ENV_Event.create({
    picId,
    categoryId,
    locationId,
    name,
    code,
    minAge: minAge || null,
    maxAge: maxAge || null,
    maxParticipantPerGroup: maxParticipantPerGroup || null,
    maxTotalParticipant: maxTotalParticipant || null,
  });

  await times.forEach(async (time) => {
    await ENV_TimeEvent.create({
      eventId: eventInstance.id,
      name: time.name,
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
    picId, categoryId, locationId, name, times, code, maxAge, minAge,
    maxParticipantPerGroup, maxTotalParticipant,
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
  eventInstance.code = code;
  eventInstance.minAge = minAge || null;
  eventInstance.maxAge = maxAge || null;
  eventInstance.maxParticipantPerGroup = maxParticipantPerGroup || null;
  eventInstance.maxTotalParticipant = maxTotalParticipant || null;
  await eventInstance.save();

  await ENV_TimeEvent.destroy({
    where: { eventId: eventInstance.id },
  });

  times?.forEach(async (time) => {
    await ENV_TimeEvent.create({
      eventId: eventInstance.id,
      name: time.name,
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
