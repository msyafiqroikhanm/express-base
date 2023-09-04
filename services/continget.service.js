/* eslint-disable no-param-reassign */
const {
  PAR_Contingent,
  REF_Region,
  PAR_Participant,
  PAR_Group,
} = require('../models');

const selectAllContingents = async () => {
  const contingents = await PAR_Contingent.findAll({
    include: [
      {
        model: REF_Region,
        as: 'region',
        attributes: ['name'],
      },
      {
        model: PAR_Participant,
        as: 'participants',
        attributes: ['id', 'name'],
      },
      {
        model: PAR_Group,
        as: 'groups',
        attributes: ['id', 'name'],
      },
    ],
  });

  contingents.forEach((contingent) => {
    contingent.dataValues.region = contingent.region.dataValues.name;
  });

  return {
    success: true, message: 'Successfully Getting All Contingent', content: contingents,
  };
};

const selectContingent = async (id) => {
  // check contingent id validity
  const contingentInstance = await PAR_Contingent.findByPk(id, {
    include: [
      {
        model: REF_Region,
        as: 'region',
        attributes: ['name'],
      },
      {
        model: PAR_Participant,
        as: 'participants',
        attributes: ['id', 'name'],
      },
      {
        model: PAR_Group,
        as: 'groups',
        attributes: ['id', 'name'],
      },
    ],
  });
  if (!contingentInstance) {
    return {
      success: false, code: 404, message: 'Contingent Data Not Found',
    };
  }

  contingentInstance.dataValues.region = contingentInstance.region.dataValues.name;

  return {
    success: true, message: 'Successfully Getting Contingent', content: contingentInstance,
  };
};

const validateContingentInput = async (form) => {
  const { regionId, name } = form;
  // check validity of regionId
  const regionInstance = await REF_Region.findByPk(regionId);
  if (!regionInstance) {
    return {
      isValid: false, code: 404, message: 'Region Data Not Found',
    };
  }

  return {
    isValid: true,
    form: { region: regionInstance, name },
  };
};

const createContingent = async (form) => {
  const contingentInstance = await PAR_Contingent.create({
    regionId: form.region.id, name: form.name,
  });

  return {
    success: true, message: 'Contingent Successfully Created', content: contingentInstance,
  };
};

const updateContingent = async (id, form) => {
  const { region, name } = form;

  // check validity of contingent id
  const contingentInstance = await PAR_Contingent.findByPk(id);
  if (!contingentInstance) {
    return {
      success: false, code: 404, message: 'Contingent Data Not Found',
    };
  }

  contingentInstance.regionId = region.id;
  contingentInstance.name = name;
  await contingentInstance.save();

  return {
    success: true, message: 'Contingent Successfully Updated', content: contingentInstance,
  };
};

const deleteContingent = async (id) => {
  // check validity of contingent id
  const contingentInstance = await PAR_Contingent.findByPk(id);
  if (!contingentInstance) {
    return {
      success: false, code: 404, message: 'Region Data Not Found',
    };
  }

  const { name } = contingentInstance.dataValues;

  await contingentInstance.destroy();

  return {
    success: true,
    message: 'Contingent Successfully Deleted',
    content: `Contingent ${name} Successfully Deleted`,
  };
};

module.exports = {
  selectAllContingents,
  selectContingent,
  validateContingentInput,
  createContingent,
  updateContingent,
  deleteContingent,
};
