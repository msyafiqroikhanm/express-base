/* eslint-disable no-param-reassign */
const { Op } = require('sequelize');
const {
  PAR_Group, ENV_Event, PAR_Contingent, REF_GroupStatus, PAR_Participant,
} = require('../models');

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
    group.dataValues.contingent = group.contingent.dataValues.name;
    group.dataValues.event = group.event.dataValues.name;
    group.dataValues.status = group.status.dataValues.name;
  });

  return {
    success: true, message: 'Successfully Getting All Groups', content: groups,
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
      success: false, code: 404, message: 'Group Data Not Found',
    };
  }

  groupInstance.dataValues.contingent = groupInstance.contingent.dataValues.name;
  groupInstance.dataValues.event = groupInstance.event.dataValues.name;
  groupInstance.dataValues.status = groupInstance.status.dataValues.name;
  groupInstance.dataValues.participants = [];
  groupInstance.PAR_Participants.forEach((participant) => {
    groupInstance.dataValues.participants.push(participant.id);
  });
  groupInstance.dataValues.participantList = groupInstance.PAR_Participants;
  delete groupInstance.dataValues.PAR_Participants;

  return {
    success: true, message: 'Successfully Getting Group', content: groupInstance,
  };
};

const validateGroupInputs = async (form, limitation = null) => {
  const {
    eventId, contingentId, statusId, name,
  } = form;

  // check eventId validity
  const eventInstance = await ENV_Event.findByPk(eventId);
  if (!eventInstance) {
    return {
      isValid: false, code: 404, message: 'Event Data Not Found',
    };
  }

  // check contingentId validity
  const contingentInstance = await PAR_Contingent.findByPk(contingentId);
  if (!contingentInstance) {
    return {
      isValid: false, code: 404, message: 'Contingent Data Not Found',
    };
  }
  if (limitation?.id && (limitation?.id !== Number(contingentId))) {
    return {
      isValid: false, code: 400, message: 'Prohibited To Create Group For Other Contingent',
    };
  }

  const statusInstance = await REF_GroupStatus.findByPk(statusId);
  if (!statusInstance) {
    return {
      isValid: false, code: 404, message: 'Status Data Not Found',
    };
  }

  // validate Recipiants / receivers
  const validParcipants = await PAR_Participant.findAll({
    where: {
      id: { [Op.in]: form.participants },
      contingentId,
    },
  });

  return {
    isValid: true,
    form: {
      event: eventInstance,
      contingent: contingentInstance,
      status: statusInstance,
      name,
      participants: validParcipants,
    },
  };
};

const createGroup = async (form) => {
  const {
    event, contingent, status, name, participants,
  } = form;

  const groupInstance = await PAR_Group.create({
    eventId: event.id, contingentId: contingent.id, statusId: status.id, name,
  });

  await groupInstance.addPAR_Participants(participants);

  return {
    success: true, message: 'Group Successfully Created', content: groupInstance,
  };
};

const updateGroup = async (id, form, where) => {
  const {
    event, contingent, status, name, participants,
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
      success: false, code: 404, message: 'Group Data Not Found',
    };
  }

  groupInstance.eventId = event.id;
  groupInstance.contingentId = contingent.id;
  groupInstance.ststatusId = status.id;
  groupInstance.name = name;
  await groupInstance.save();

  await groupInstance.setPAR_Participants(participants);

  return {
    success: true, message: 'Group Successfully Updated', content: groupInstance,
  };
};

const deleteGroup = async (id, where) => {
  const groupInstance = await PAR_Group.findByPk(id, {
    include: { model: PAR_Contingent, as: 'contingent', where },
  });
  if (!groupInstance) {
    return {
      success: false, code: 404, message: 'Group Data Not Found',
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
