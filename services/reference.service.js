const {
  REF_ConfigurationCategory,
  SYS_Configuration,
  REF_QRType,
  REF_EventCategory,
  REF_Region,
  REF_GroupStatus,
  REF_ParticipantType,
  REF_IdentityType,
} = require('../models');

const selectAllConfigCategories = async () => {
  const data = await REF_ConfigurationCategory.findAll();
  return data;
};

const selectConfiCategory = async (id) => {
  const data = await REF_ConfigurationCategory.findByPk(id, {
    include: { model: SYS_Configuration },
  });

  if (!data) {
    const error = { success: false, message: 'System Configuration Category Not Found' };
    return error;
  }
  return { success: true, message: 'Successfully Getting System Configuration Category', content: data };
};

const createSysConfigCategory = async (form) => {
  const data = await REF_ConfigurationCategory.create(form);
  return { success: true, message: 'System Configuration Category Successfully Created', content: data };
};

const updateSysConfigCategory = async (id, form) => {
  // get category data (instance)
  const categoryInstance = await REF_ConfigurationCategory.findByPk(id);

  // when category data is not found throw an error
  if (!categoryInstance) {
    const error = { success: false, message: 'System Configuration Category Data Not Found' };
    return error;
  }

  // update category data after pass all the check
  categoryInstance.name = form.name;
  await categoryInstance.save();

  return { success: true, message: 'System Configuration Category Successfully Updated', content: categoryInstance };
};

const deleteSysConfigCategory = async (id) => {
  // check validity of sys config id
  const configInstance = await REF_ConfigurationCategory.findByPk(id);
  if (!configInstance) {
    const error = { success: false, message: 'System Configuration Data Not Found' };
    return error;
  }

  const { name } = configInstance.dataValues;

  // delete sys config after passing the check
  await configInstance.destroy();
  return {
    success: true,
    message: 'System Configuration Successfully Deleted',
    content: `System Configuration ${name} Successfully Deleted`,
  };
};

const selectAllQRTypes = async () => {
  const data = await REF_QRType.findAll();
  return data;
};

const selectQRType = async (id) => {
  // check validity of qrtype id
  const data = await REF_QRType.findByPk(id);
  if (!data) {
    const error = { success: false, message: 'QR Type Data Not Found' };
    return error;
  }

  return { success: true, message: 'Successfully Getting QR Type Data', content: data };
};

const createQRType = async (form) => {
  const qrTypeInstance = await REF_QRType.create(form);
  return { success: true, message: 'QR Type Successfully Created', content: qrTypeInstance };
};

const updateQRType = async (id, form) => {
  // check qr type id validity
  const qrTypeInstance = await REF_QRType.findByPk(id);
  if (!qrTypeInstance) {
    const error = { success: false, message: 'QR Type Data Not Found' };
    return error;
  }

  // update data after success pass the check
  qrTypeInstance.name = form.name;
  qrTypeInstance.label = form.label;
  await qrTypeInstance.save();

  return { success: true, message: 'QR Type Successfully Updated', content: qrTypeInstance };
};

const deleteQRType = async (id) => {
  // check qr type validity
  const qrTypeInstance = await REF_QRType.findByPk(id);
  if (!qrTypeInstance) {
    const error = { success: false, message: 'QR Type Data Not Found' };
    return error;
  }

  const { name } = qrTypeInstance.dataValues;

  // delete the qr type after passsing the check
  await qrTypeInstance.destroy();

  return {
    success: true,
    message: 'QR Type Successfully Deleted',
    content: `QR Type ${name} Successfully Deleted`,
  };
};

const selectAllEventCategories = async () => {
  const data = await REF_EventCategory.findAll();
  return {
    success: true, message: 'Successfully Getting All Event Category', content: data,
  };
};

const selectEventCategory = async (id) => {
  // check validity of event category id
  const categoryInstance = await REF_EventCategory.findByPk(id);
  if (!categoryInstance) {
    return {
      success: false, code: 404, message: 'Event Category Data Not Found',
    };
  }

  return {
    success: true, message: 'Successfully Getting Event Category', content: categoryInstance,
  };
};

const createEventCategory = async (form) => {
  const categoryInstance = await REF_EventCategory.create({ name: form.name });

  return {
    success: true, message: 'Event Category Successfully Created', content: categoryInstance,
  };
};

const updateEventCategory = async (id, form) => {
  // check validity of event category id
  const categoryInstance = await REF_EventCategory.findByPk(id);
  if (!categoryInstance) {
    return {
      success: false, code: 404, message: 'Event Category Data Not Found',
    };
  }

  categoryInstance.name = form.name;
  await categoryInstance.save();
  return {
    success: true, message: 'Event Category Successfully Updated', content: categoryInstance,
  };
};

const deleteEventCategory = async (id) => {
  // check validity of event category id
  const categoryInstance = await REF_EventCategory.findByPk(id);
  if (!categoryInstance) {
    return {
      success: false, code: 404, message: 'Event Category Data Not Found',
    };
  }

  const { name } = categoryInstance.dataValues;

  await categoryInstance.destroy();

  return {
    success: true,
    message: 'Event Category Successfully Deleted',
    content: `Event Category ${name} Successfully Deleted`,
  };
};

const selectAllRegions = async () => {
  const regions = await REF_Region.findAll();

  return {
    success: true, message: 'Successfully Getting All Region', content: regions,
  };
};

const selectRegion = async (id) => {
  // check region id validity
  const regionInstance = await REF_Region.findByPk(id);
  if (!regionInstance) {
    return {
      success: false, message: 'Region Data Not Found',
    };
  }

  return {
    success: true, message: 'Successfully Getting Region', content: regionInstance,
  };
};

const createRegion = async (form) => {
  const regionInstance = await REF_Region.create({ name: form.name });

  return {
    success: true, message: 'Region Successfully Created', content: regionInstance,
  };
};

const updateRegion = async (id, form) => {
  // check region id validity
  const regionInstance = await REF_Region.findByPk(id);
  if (!regionInstance) {
    return {
      success: false, message: 'Region Data Not Found',
    };
  }

  regionInstance.name = form.name;
  await regionInstance.save();

  return {
    success: true, message: 'Region Successfully Created', content: regionInstance,
  };
};

const deleteRegion = async (id) => {
  // check region id validity
  const regionInstance = await REF_Region.findByPk(id);
  if (!regionInstance) {
    return {
      success: false, message: 'Region Data Not Found',
    };
  }

  const { name } = regionInstance.dataValues;

  await regionInstance.destroy();

  return {
    success: true,
    message: 'Region Successfully Deleted',
    content: `Region ${name} Successfully Deleted`,
  };
};

const selectAllGroupStatuses = async () => {
  const statuses = await REF_GroupStatus.findAll();

  return {
    success: true, message: 'Successfully Getting All Group Status', content: statuses,
  };
};

const selectGroupStatus = async (id) => {
  // check group status id validity
  const statusInstance = await REF_GroupStatus.findByPk(id);
  if (!statusInstance) {
    return {
      success: false, message: 'Group Status Data Not Found',
    };
  }

  return {
    success: true, message: 'Successfully Getting Group Status', content: statusInstance,
  };
};

const createGroupStatus = async (form) => {
  const statusInstance = await REF_GroupStatus.create({ name: form.name });

  return {
    success: true, message: 'Group Status Successfully Created', content: statusInstance,
  };
};

const updateGroupStatus = async (id, form) => {
  // check group status id validity
  const statusInstance = await REF_GroupStatus.findByPk(id);
  if (!statusInstance) {
    return {
      success: false, message: 'Group Status Data Not Found',
    };
  }

  statusInstance.name = form.name;
  await statusInstance.save();

  return {
    success: true, message: 'Group Status Successfully Created', content: statusInstance,
  };
};

const deleteGroupStatus = async (id) => {
  // check group status id validity
  const statusInstance = await REF_GroupStatus.findByPk(id);
  if (!statusInstance) {
    return {
      success: false, message: 'Group Status Data Not Found',
    };
  }

  const { name } = statusInstance.dataValues;

  await statusInstance.destroy();

  return {
    success: true,
    message: 'Group Status Successfully Deleted',
    content: `Group Status ${name} Successfully Deleted`,
  };
};

const selectAllParticipantTypes = async () => {
  const types = await REF_ParticipantType.findAll();

  return {
    success: true, message: 'Successfully Getting All Participant Type', content: types,
  };
};

const selectParticipantType = async (id) => {
  // check participant type id validity
  const typeInstance = await REF_ParticipantType.findByPk(id);
  if (!typeInstance) {
    return {
      success: false, message: 'Participant Type Data Not Found',
    };
  }

  return {
    success: true, message: 'Successfully Getting Participant Type', content: typeInstance,
  };
};

const createParticipantType = async (form) => {
  const typeInstance = await REF_ParticipantType.create({ name: form.name });

  return {
    success: true, message: 'Participant Type Successfully Created', content: typeInstance,
  };
};

const updateParticipantType = async (id, form) => {
  // check participant type id validity
  const typeInstance = await REF_ParticipantType.findByPk(id);
  if (!typeInstance) {
    return {
      success: false, message: 'Participant Type Data Not Found',
    };
  }

  typeInstance.name = form.name;
  await typeInstance.save();

  return {
    success: true, message: 'Participant Type Successfully Created', content: typeInstance,
  };
};

const deleteParticipantType = async (id) => {
  // check participant type id validity
  const typeInstance = await REF_ParticipantType.findByPk(id);
  if (!typeInstance) {
    return {
      success: false, message: 'Participant Type Data Not Found',
    };
  }

  const { name } = typeInstance.dataValues;

  await typeInstance.destroy();

  return {
    success: true,
    message: 'Participant Type Successfully Deleted',
    content: `Participant Type ${name} Successfully Deleted`,
  };
};

const selectAllIdentityTypes = async () => {
  const types = await REF_IdentityType.findAll();

  return {
    success: true, message: 'Successfully Getting All Identity Type', content: types,
  };
};

const selectIdentityType = async (id) => {
  // check identity type id validity
  const typeInstance = await REF_IdentityType.findByPk(id);
  if (!typeInstance) {
    return {
      success: false, message: 'Identity Type Data Not Found',
    };
  }

  return {
    success: true, message: 'Successfully Getting Identity Type', content: typeInstance,
  };
};

const createIdentityType = async (form) => {
  const typeInstance = await REF_IdentityType.create({ name: form.name });

  return {
    success: true, message: 'Identity Type Successfully Created', content: typeInstance,
  };
};

const updateIdentityType = async (id, form) => {
  // check identity type id validity
  const typeInstance = await REF_IdentityType.findByPk(id);
  if (!typeInstance) {
    return {
      success: false, message: 'Identity Type Data Not Found',
    };
  }

  typeInstance.name = form.name;
  await typeInstance.save();

  return {
    success: true, message: 'Identity Type Successfully Created', content: typeInstance,
  };
};

const deleteIdentityType = async (id) => {
  // check identity type id validity
  const typeInstance = await REF_IdentityType.findByPk(id);
  if (!typeInstance) {
    return {
      success: false, message: 'Identity Type Data Not Found',
    };
  }

  const { name } = typeInstance.dataValues;

  await typeInstance.destroy();

  return {
    success: true,
    message: 'Identity Type Successfully Deleted',
    content: `Identity Type ${name} Successfully Deleted`,
  };
};

module.exports = {
  selectAllConfigCategories,
  selectConfiCategory,
  createSysConfigCategory,
  updateSysConfigCategory,
  deleteSysConfigCategory,
  selectAllQRTypes,
  selectQRType,
  createQRType,
  updateQRType,
  deleteQRType,
  eventCategory: {
    selectEventCategory,
    selectAllEventCategories,
    createEventCategory,
    updateEventCategory,
    deleteEventCategory,
  },
  region: {
    selectAllRegions,
    selectRegion,
    createRegion,
    updateRegion,
    deleteRegion,
  },
  groupStatus: {
    selectAllGroupStatuses,
    selectGroupStatus,
    createGroupStatus,
    updateGroupStatus,
    deleteGroupStatus,
  },
  participantType: {
    selectAllParticipantTypes,
    selectParticipantType,
    createParticipantType,
    updateParticipantType,
    deleteParticipantType,
  },
  identityType: {
    selectAllIdentityTypes,
    selectIdentityType,
    createIdentityType,
    updateIdentityType,
    deleteIdentityType,
  },
};
