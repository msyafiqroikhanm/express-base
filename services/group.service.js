/* eslint-disable no-param-reassign */
const { Op } = require('sequelize');
const {
  PAR_Group,
  ENV_Event,
  PAR_Contingent,
  REF_GroupStatus,
  PAR_Participant,
  SYS_Configuration,
} = require('../models');
const { calculateAge } = require('./participant.service');

const selectAllGroups = async (where) => {
  const groups = await PAR_Group.findAll({
    where,
    include: [
      {
        model: PAR_Contingent,
        as: 'contingent',
        attributes: ['name'],
      },
      {
        model: ENV_Event,
        as: 'event',
        attributes: ['name'],
      },
      {
        model: REF_GroupStatus,
        as: 'status',
        attributes: ['name'],
      },
      {
        model: PAR_Participant,
        attributes: ['id', 'name'],
        through: {
          attributes: [],
        },
      },
    ],
  });

  groups.forEach((group) => {
    group.dataValues.contingent = group.contingent?.dataValues.name;
    group.dataValues.event = group.event?.dataValues.name;
    group.dataValues.status = group.status?.dataValues.name;
  });

  return {
    success: true,
    message: 'Successfully Getting All Groups',
    content: groups,
  };
};

const selectGroup = async (id, where) => {
  const groupInstance = await PAR_Group.findByPk(id, {
    include: [
      {
        model: PAR_Contingent,
        as: 'contingent',
        where,
        attributes: ['name'],
      },
      {
        model: ENV_Event,
        as: 'event',
        attributes: ['name'],
      },
      {
        model: REF_GroupStatus,
        as: 'status',
        attributes: ['name'],
      },
      {
        model: PAR_Participant,
        attributes: ['id', 'name'],
        through: {
          attributes: [],
        },
      },
    ],
  });

  if (!groupInstance) {
    return {
      success: false,
      code: 404,
      message: 'Group Data Not Found',
    };
  }

  groupInstance.dataValues.contingent = groupInstance.contingent?.dataValues.name;
  groupInstance.dataValues.event = groupInstance.event?.dataValues.name;
  groupInstance.dataValues.status = groupInstance.status?.dataValues.name;
  groupInstance.dataValues.participants = [];
  groupInstance.PAR_Participants.forEach((participant) => {
    groupInstance.dataValues.participants.push(participant?.id);
  });
  groupInstance.dataValues.participantList = groupInstance?.PAR_Participants;
  delete groupInstance.dataValues.PAR_Participants;

  return {
    success: true,
    message: 'Successfully Getting Group',
    content: groupInstance,
  };
};

const validateGroupInputs = async (form, id, limitation = null) => {
  const { eventId, contingentId, name } = form;

  const invalid400 = [];
  const invalid404 = [];
  const formParticipants = [];

  // check eventId validity
  const eventInstance = await ENV_Event.findOne({
    where: { id: eventId },
    include: {
      model: PAR_Group,
      attributes: ['id'],
      include: {
        model: PAR_Participant,
        attributes: ['id', 'name'],
        through: {
          attributes: [],
        },
      },
    },
  });
  if (!eventInstance) {
    invalid404.push('Event Data Not Found');
  }

  // assingning participant that already regirestered to the event
  const registeredParticipants = eventInstance.PAR_Groups
    .flatMap((group) => group.PAR_Participants)
    .map((participant) => ({ id: participant.id, name: participant.name }));

  // check contingentId validity
  const contingentInstance = await PAR_Contingent.findByPk(contingentId);
  if (!contingentInstance) {
    invalid404.push('Contingent Data Not Found');
  }
  if (limitation?.id && limitation?.id !== Number(contingentId)) {
    return {
      isValid: false,
      code: 400,
      message: ['Prohibited To Create Group For Other Contingent'],
    };
  }

  const statusInstance = await REF_GroupStatus.findOne({
    where: { name: { [Op.in]: ['Active', 'active', 'Live'] } },
  });
  if (!statusInstance) {
    invalid404.push('Status Data Not Found');
  }

  let validParticipants;

  if (form.participants.length <= eventInstance.maxParticipantPerGroup) {
    // validate Recipiants / receivers
    validParticipants = await PAR_Participant.findAll({
      where: {
        id: { [Op.in]: form.participants },
        contingentId,
      },
    });
    if (validParticipants.length) {
      const startEvent = await SYS_Configuration.findOne({
        where: { name: { [Op.substring]: 'Event Start' } },
      });
      validParticipants.forEach((participant) => {
        const age = calculateAge(participant.birthDate, startEvent.value);
        if (eventInstance?.minAge <= age && eventInstance.maxAge >= age) {
          formParticipants.push(participant.id);
        } else {
          invalid400.push(
            'Participant on behalf of a does not meet the minimum or maximum age criteria',
          );
        }
      });
    } else {
      invalid404.push('Participants Data Not Found');
    }
  } else {
    invalid400.push('The Number Of Participants Exceeded The Quota Provided');
  }

  if (!formParticipants.length) {
    invalid404.push('Participant Data Does Not Meet the Criteria');
  }

  // check user already registered to an event
  if (id) {
    const groupInstance = await PAR_Group.findOne({
      where: { id },
      include: {
        model: PAR_Participant,
        attributes: ['id'],
        through: {
          attributes: [],
        },
      },
    });

    const oldParticipants = groupInstance?.PAR_Participants.map((participant) => participant.id);

    const filteredRegisteredParticipants = registeredParticipants.filter(
      (participant) => !oldParticipants.includes(participant.id),
    );

    filteredRegisteredParticipants.forEach((participant) => {
      if (formParticipants.includes(participant.id)) {
        invalid400.push(`Participant ${participant.name} Already Registered`);
      }
    });
  } else {
    registeredParticipants.forEach((participant) => {
      if (formParticipants.includes(participant.id)) {
        invalid400.push(`Participant ${participant.name} Already Registered`);
      }
    });
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
      event: eventInstance,
      contingent: contingentInstance,
      status: statusInstance,
      name,
      participants: formParticipants,
    },
  };
};

const createGroup = async (form) => {
  const {
    event, contingent, status, name, participants,
  } = form;

  const groupInstance = await PAR_Group.create({
    eventId: event.id,
    contingentId: contingent.id,
    statusId: status.id,
    name,
  });

  await groupInstance.addPAR_Participants(participants);

  return {
    success: true,
    message: 'Group Successfully Created',
    content: groupInstance,
  };
};

const updateGroup = async (id, form, where) => {
  const {
    event, contingent, name, participants,
  } = form;

  let groupInstance;
  if (Object.keys(where).length > 0) {
    groupInstance = await PAR_Group.findByPk(id, {
      include: { model: PAR_Contingent, as: 'contingent', where },
    });
  } else {
    groupInstance = await PAR_Group.findByPk(id);
  }
  if (!groupInstance) {
    return {
      success: false,
      code: 404,
      message: ['Group Data Not Found'],
    };
  }

  groupInstance.eventId = event.id;
  groupInstance.contingentId = contingent.id;
  groupInstance.name = name;
  await groupInstance.save();

  await groupInstance.setPAR_Participants(participants);

  return {
    success: true,
    message: 'Group Successfully Updated',
    content: groupInstance,
  };
};

const deleteGroup = async (id, where) => {
  const groupInstance = await PAR_Group.findByPk(id, {
    include: { model: PAR_Contingent, as: 'contingent', where },
  });
  if (!groupInstance) {
    return {
      success: false,
      code: 404,
      message: ['Group Data Not Found'],
    };
  }

  const { name } = groupInstance.dataValues;

  await groupInstance.setPAR_Participants([]);

  await groupInstance.destroy();

  return {
    success: true,
    message: 'Group Successfully Deleted',
    content: `Group ${name} Successfully Deleted`,
  };
};

module.exports = {
  selectAllGroups,
  selectGroup,
  validateGroupInputs,
  createGroup,
  updateGroup,
  deleteGroup,
};
