const { Op } = require('sequelize');
const { CSM_InformationCenter, REF_ParticipantType } = require('../models');

const validateInformationCenterQuery = async (query) => {
  const validQuery = {};

  if (query.target) {
    const typeInstance = await REF_ParticipantType.findOne({ where: { name: { [Op.like]: `%${query.target}%` } } });
    validQuery.participantType = { id: typeInstance.id };
  }

  return validQuery;
};

const selectAllInformationCenters = async (query) => {
  const data = await CSM_InformationCenter.findAll({
    include: {
      model: REF_ParticipantType,
      where: query.participantType,
      attributes: ['id', 'name'],
      as: 'participantType',
      through: {
        attributes: [],
      },
    },
  });

  return {
    success: true,
    message: 'Succesfully Getting All Information Center',
    content: data,
  };
};

const selectInformationCenter = async (id) => {
  const icInstance = await CSM_InformationCenter.findByPk(id, {
    include: {
      model: REF_ParticipantType,
      attributes: ['id', 'name'],
      as: 'participantType',
      through: {
        attributes: [],
      },
    },
  });
  if (!icInstance) {
    return {
      success: false,
      code: 404,
      message: 'Information Center Data Not Found',
    };
  }

  icInstance.dataValues.participantTypes = [];
  icInstance.participantType.forEach((participant) => {
    icInstance.dataValues.participantTypes.push(participant.id);
  });

  return {
    success: true,
    message: 'Successfully Getting Information Center',
    content: icInstance,
  };
};

const validateInformationCenterInputs = async (form) => {
  // check if array of participant type is correct
  const validParticipantTypes = await REF_ParticipantType.findAll({
    where: { id: { [Op.in]: form.participantTypes } },
  });

  return {
    isValid: true,
    form: {
      title: form.title,
      description: form.description,
      participantTypes: validParticipantTypes,
    },
  };
};

const createInformationCenter = async (form) => {
  const { title, description, participantTypes } = form;

  const icInstance = await CSM_InformationCenter.create({ title, description });

  await icInstance.addParticipantType(participantTypes);

  const newIcInstance = await CSM_InformationCenter.findByPk(icInstance.id, {
    include: {
      model: REF_ParticipantType,
      attributes: ['id', 'name'],
      as: 'participantType',
      through: {
        attributes: [],
      },
    },
  });

  return {
    success: true,
    message: 'Information Center Successfully Created',
    content: newIcInstance,
  };
};

const updateInfomationCenter = async (form, id) => {
  const { title, description, participantTypes } = form;

  // check inforamation center id validity
  const icInstance = await CSM_InformationCenter.findByPk(id);
  if (!icInstance) {
    return {
      success: false,
      code: 404,
      message: 'Information Center Data Not Found',
    };
  }

  icInstance.title = title;
  icInstance.description = description;
  await icInstance.save();

  await icInstance.setParticipantType(participantTypes);

  const newIcInstance = await CSM_InformationCenter.findByPk(icInstance.id, {
    include: {
      model: REF_ParticipantType,
      attributes: ['id', 'name'],
      as: 'participantType',
      through: {
        attributes: [],
      },
    },
  });

  return {
    success: true,
    message: 'Information Center Successfully Updated',
    content: newIcInstance,
  };
};

const deleteInformationCenter = async (id) => {
  // check inforamation center id validity
  const icInstance = await CSM_InformationCenter.findByPk(id);
  if (!icInstance) {
    return {
      success: false,
      code: 404,
      message: 'Information Center Data Not Found',
    };
  }

  const { title } = icInstance.dataValues;

  await icInstance.setParticipantType([]);

  await icInstance.destroy();

  return {
    success: true,
    message: 'Information Center Successfully Deleted',
    content: `Information Center ${title} Successfully Deleted`,
  };
};

module.exports = {
  selectAllInformationCenters,
  selectInformationCenter,
  validateInformationCenterInputs,
  createInformationCenter,
  updateInfomationCenter,
  deleteInformationCenter,
  validateInformationCenterQuery,
};
