const {
  REF_ConfigurationCategory,
  SYS_Configuration,
  REF_QRType,
  REF_EventCategory,
  REF_Region,
  REF_GroupStatus,
  REF_ParticipantType,
  REF_IdentityType,
  REF_LocationType,
  REF_ChatBotResponseType,
  REF_FeedbackType,
  REF_FeedbackTarget,
  REF_FeedbackStatus,
  REF_FAQType,
  REF_TemplateCategory,
  REF_MetaTemplateCategory,
  REF_TemplateHeaderType,
  REF_InformationCenterTargetType,
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
    const error = {
      success: false,
      message: 'System Configuration Category Not Found',
    };
    return error;
  }
  return {
    success: true,
    message: 'Successfully Getting System Configuration Category',
    content: data,
  };
};

const createSysConfigCategory = async (form) => {
  const data = await REF_ConfigurationCategory.create(form);
  return {
    success: true,
    message: 'System Configuration Category Successfully Created',
    content: data,
  };
};

const updateSysConfigCategory = async (id, form) => {
  // get category data (instance)
  const categoryInstance = await REF_ConfigurationCategory.findByPk(id);

  // when category data is not found throw an error
  if (!categoryInstance) {
    const error = {
      success: false,
      message: 'System Configuration Category Data Not Found',
    };
    return error;
  }

  // update category data after pass all the check
  categoryInstance.name = form.name;
  await categoryInstance.save();

  return {
    success: true,
    message: 'System Configuration Category Successfully Updated',
    content: categoryInstance,
  };
};

const deleteSysConfigCategory = async (id) => {
  // check validity of sys config id
  const configInstance = await REF_ConfigurationCategory.findByPk(id);
  if (!configInstance) {
    const error = {
      success: false,
      message: 'System Configuration Data Not Found',
    };
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

  return {
    success: true,
    message: 'Successfully Getting QR Type Data',
    content: data,
  };
};

const createQRType = async (form) => {
  const qrTypeInstance = await REF_QRType.create(form);
  return {
    success: true,
    message: 'QR Type Successfully Created',
    content: qrTypeInstance,
  };
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

  return {
    success: true,
    message: 'QR Type Successfully Updated',
    content: qrTypeInstance,
  };
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
    success: true,
    message: 'Successfully Getting All Event Category',
    content: data,
  };
};

const selectEventCategory = async (id) => {
  // check validity of event category id
  const categoryInstance = await REF_EventCategory.findByPk(id);
  if (!categoryInstance) {
    return {
      success: false,
      code: 404,
      message: 'Event Category Data Not Found',
    };
  }

  return {
    success: true,
    message: 'Successfully Getting Event Category',
    content: categoryInstance,
  };
};

const createEventCategory = async (form) => {
  const categoryInstance = await REF_EventCategory.create({ name: form.name });

  return {
    success: true,
    message: 'Event Category Successfully Created',
    content: categoryInstance,
  };
};

const updateEventCategory = async (id, form) => {
  // check validity of event category id
  const categoryInstance = await REF_EventCategory.findByPk(id);
  if (!categoryInstance) {
    return {
      success: false,
      code: 404,
      message: 'Event Category Data Not Found',
    };
  }

  categoryInstance.name = form.name;
  await categoryInstance.save();
  return {
    success: true,
    message: 'Event Category Successfully Updated',
    content: categoryInstance,
  };
};

const deleteEventCategory = async (id) => {
  // check validity of event category id
  const categoryInstance = await REF_EventCategory.findByPk(id);
  if (!categoryInstance) {
    return {
      success: false,
      code: 404,
      message: 'Event Category Data Not Found',
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
    success: true,
    message: 'Successfully Getting All Region',
    content: regions,
  };
};

const selectRegion = async (id) => {
  // check region id validity
  const regionInstance = await REF_Region.findByPk(id);
  if (!regionInstance) {
    return {
      success: false,
      message: 'Region Data Not Found',
    };
  }

  return {
    success: true,
    message: 'Successfully Getting Region',
    content: regionInstance,
  };
};

const createRegion = async (form) => {
  const regionInstance = await REF_Region.create({ name: form.name });

  return {
    success: true,
    message: 'Region Successfully Created',
    content: regionInstance,
  };
};

const updateRegion = async (id, form) => {
  // check region id validity
  const regionInstance = await REF_Region.findByPk(id);
  if (!regionInstance) {
    return {
      success: false,
      message: 'Region Data Not Found',
    };
  }

  regionInstance.name = form.name;
  await regionInstance.save();

  return {
    success: true,
    message: 'Region Successfully Created',
    content: regionInstance,
  };
};

const deleteRegion = async (id) => {
  // check region id validity
  const regionInstance = await REF_Region.findByPk(id);
  if (!regionInstance) {
    return {
      success: false,
      message: 'Region Data Not Found',
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
    success: true,
    message: 'Successfully Getting All Group Status',
    content: statuses,
  };
};

const selectGroupStatus = async (id) => {
  // check group status id validity
  const statusInstance = await REF_GroupStatus.findByPk(id);
  if (!statusInstance) {
    return {
      success: false,
      message: 'Group Status Data Not Found',
    };
  }

  return {
    success: true,
    message: 'Successfully Getting Group Status',
    content: statusInstance,
  };
};

const createGroupStatus = async (form) => {
  const statusInstance = await REF_GroupStatus.create({ name: form.name });

  return {
    success: true,
    message: 'Group Status Successfully Created',
    content: statusInstance,
  };
};

const updateGroupStatus = async (id, form) => {
  // check group status id validity
  const statusInstance = await REF_GroupStatus.findByPk(id);
  if (!statusInstance) {
    return {
      success: false,
      message: 'Group Status Data Not Found',
    };
  }

  statusInstance.name = form.name;
  await statusInstance.save();

  return {
    success: true,
    message: 'Group Status Successfully Created',
    content: statusInstance,
  };
};

const deleteGroupStatus = async (id) => {
  // check group status id validity
  const statusInstance = await REF_GroupStatus.findByPk(id);
  if (!statusInstance) {
    return {
      success: false,
      message: 'Group Status Data Not Found',
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
    success: true,
    message: 'Successfully Getting All Participant Type',
    content: types,
  };
};

const selectParticipantType = async (id) => {
  // check participant type id validity
  const typeInstance = await REF_ParticipantType.findByPk(id);
  if (!typeInstance) {
    return {
      success: false,
      message: 'Participant Type Data Not Found',
    };
  }

  return {
    success: true,
    message: 'Successfully Getting Participant Type',
    content: typeInstance,
  };
};

const createParticipantType = async (form) => {
  const typeInstance = await REF_ParticipantType.create({ name: form.name });

  return {
    success: true,
    message: 'Participant Type Successfully Created',
    content: typeInstance,
  };
};

const updateParticipantType = async (id, form) => {
  // check participant type id validity
  const typeInstance = await REF_ParticipantType.findByPk(id);
  if (!typeInstance) {
    return {
      success: false,
      message: 'Participant Type Data Not Found',
    };
  }

  typeInstance.name = form.name;
  await typeInstance.save();

  return {
    success: true,
    message: 'Participant Type Successfully Created',
    content: typeInstance,
  };
};

const deleteParticipantType = async (id) => {
  // check participant type id validity
  const typeInstance = await REF_ParticipantType.findByPk(id);
  if (!typeInstance) {
    return {
      success: false,
      message: 'Participant Type Data Not Found',
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
    success: true,
    message: 'Successfully Getting All Identity Type',
    content: types,
  };
};

const selectIdentityType = async (id) => {
  // check identity type id validity
  const typeInstance = await REF_IdentityType.findByPk(id);
  if (!typeInstance) {
    return {
      success: false,
      message: 'Identity Type Data Not Found',
    };
  }

  return {
    success: true,
    message: 'Successfully Getting Identity Type',
    content: typeInstance,
  };
};

const createIdentityType = async (form) => {
  const typeInstance = await REF_IdentityType.create({ name: form.name });

  return {
    success: true,
    message: 'Identity Type Successfully Created',
    content: typeInstance,
  };
};

const updateIdentityType = async (id, form) => {
  // check identity type id validity
  const typeInstance = await REF_IdentityType.findByPk(id);
  if (!typeInstance) {
    return {
      success: false,
      message: 'Identity Type Data Not Found',
    };
  }

  typeInstance.name = form.name;
  await typeInstance.save();

  return {
    success: true,
    message: 'Identity Type Successfully Updated',
    content: typeInstance,
  };
};

const deleteIdentityType = async (id) => {
  // check identity type id validity
  const typeInstance = await REF_IdentityType.findByPk(id);
  if (!typeInstance) {
    return {
      success: false,
      message: 'Identity Type Data Not Found',
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

const selectAllLocationTypes = async () => {
  const locationTypes = await REF_LocationType.findAll();

  return {
    success: true,
    message: 'Successfully Getting All Location Type',
    content: locationTypes,
  };
};

const selectLocationType = async (id) => {
  const locationType = await REF_LocationType.findByPk(id);
  if (!locationType) {
    return {
      success: false,
      message: 'Location Type Data Not Found',
    };
  }

  return {
    success: true,
    message: 'Successfully Gettinh All Location Type',
    content: locationType,
  };
};

const createLocationType = async (form) => {
  const locationType = await REF_LocationType.create({ name: form.name });

  return {
    success: true,
    message: 'Location Type Successfully Created',
    content: locationType,
  };
};

const updateLocationType = async (id, form) => {
  // check identity type id validity
  const typeInstance = await REF_LocationType.findByPk(id);
  if (!typeInstance) {
    return {
      success: false,
      message: 'Location Type Data Not Found',
    };
  }

  typeInstance.name = form.name;
  await typeInstance.save();

  return {
    success: true,
    message: 'Location Type Successfully Updated',
    content: typeInstance,
  };
};

const deleteLocationType = async (id) => {
  // check identity type id validity
  const typeInstance = await REF_LocationType.findByPk(id);
  if (!typeInstance) {
    return {
      success: false,
      message: 'Location Type Data Not Found',
    };
  }

  const { name } = typeInstance.dataValues;

  await typeInstance.destroy();

  return {
    success: true,
    message: 'Location Type Successfully Deleted',
    content: `Location Type ${name} Successfully Deleted`,
  };
};

//* Chatbot Response Type
const selectAllChatbotResponseTypes = async () => {
  const data = await REF_ChatBotResponseType.findAll();

  return {
    success: true,
    message: 'Successfully Getting All Chatbot Response Type',
    content: data,
  };
};

const selectChatbotResponsetype = async (id) => {
  // check chatbot response type id validity
  const typeInstance = await REF_ChatBotResponseType.findByPk(id);
  if (!typeInstance) {
    return {
      success: false, code: 404, message: 'Chatbot Response Type Data Not Found',
    };
  }

  return {
    success: true, message: 'Successfully Getting Chatbot Response Type', content: typeInstance,
  };
};

const createChatbotResponseType = async (form) => {
  const typeInstance = await REF_ChatBotResponseType.create({ name: form.name });

  return {
    success: true, message: 'Chatbot Response Type Successfully Created', content: typeInstance,
  };
};

const updateChatbotResponseType = async (form, id) => {
  // check validity of chatbot response type id
  const typeInstance = await REF_ChatBotResponseType.findByPk(id);
  if (!typeInstance) {
    return {
      success: false, code: 404, message: 'Chatbot Response Type Data Not Found',
    };
  }

  typeInstance.name = form.name;
  await typeInstance.save();

  return {
    success: true,
    message: 'Chatbot Response Type Successfully Updated',
    content: typeInstance,
  };
};

const deleteChatbotResponseType = async (id) => {
  // check validity of chatbot response type id
  const typeInstance = await REF_ChatBotResponseType.findByPk(id);
  if (!typeInstance) {
    return {
      success: false, code: 404, message: 'Chatbot Response Type Data Not Found',
    };
  }

  const { name } = typeInstance.dataValues;

  await typeInstance.destroy();

  return {
    success: true,
    message: 'Chatbot Response Type Successfully Deleted',
    content: `Chatbot Response Type ${name} Successfully Deleted`,
  };
};

const selectAllFeedbackTypes = async () => {
  const data = await REF_FeedbackType.findAll();

  return {
    success: true,
    message: 'Successfully Getting All Feedback Type',
    content: data,
  };
};

const selectFeedbackType = async (id) => {
  const typeInstance = await REF_FeedbackType.findByPk(id);
  if (!typeInstance) {
    return {
      success: false,
      code: 404,
      message: 'Feedback Type Data Not Found',
    };
  }

  return {
    success: true,
    message: 'Successfully Getting Feedback Type',
    content: typeInstance,
  };
};

const createFeedbackType = async (form) => {
  const typeInstance = await REF_FeedbackType.create({ name: form.name });

  return {
    success: true,
    message: 'Feedback Type Successfully Created',
    content: typeInstance,
  };
};

const updateFeedbackType = async (form, id) => {
  const typeInstance = await REF_FeedbackType.findByPk(id);
  if (!typeInstance) {
    return {
      success: false,
      code: 404,
      message: 'Feedback Type Data Not Found',
    };
  }

  typeInstance.name = form.name;
  await typeInstance.save();

  return {
    success: true,
    message: 'Feedback Type Successfully Updated',
    content: typeInstance,
  };
};

const deleteFeedbackType = async (id) => {
  const typeInstance = await REF_FeedbackType.findByPk(id);
  if (!typeInstance) {
    return {
      success: false,
      code: 404,
      message: 'Feedback Type Data Not Found',
    };
  }

  const { name } = typeInstance.dataValues;

  await typeInstance.destroy();

  return {
    success: true,
    message: 'Feedback Type Successfully Deleted',
    content: `Feedback Type ${name} Successfully Deleted`,
  };
};

const selectAllFeedbackTargets = async () => {
  const data = await REF_FeedbackTarget.findAll();

  return {
    success: true,
    message: 'Successfully Getting All Feedback Target',
    content: data,
  };
};

const selectFeedbackTarget = async (id) => {
  const targetInstance = await REF_FeedbackTarget.findByPk(id);
  if (!targetInstance) {
    return {
      success: false,
      code: 404,
      message: 'Feedback Type Data Not Found',
    };
  }

  return {
    success: true,
    message: 'Successfully Getting Feedback Target',
    content: targetInstance,
  };
};

const createFeedbackTarget = async (form) => {
  const targetInstance = await REF_FeedbackTarget.create({ name: form.name });

  return {
    success: true,
    message: 'Feedback Target Successfully Created',
    content: targetInstance,
  };
};

const updateFeedbackTarget = async (form, id) => {
  const targetInstance = await REF_FeedbackTarget.findByPk(id);
  if (!targetInstance) {
    return {
      success: false,
      code: 404,
      message: 'Feedback Type Data Not Found',
    };
  }

  targetInstance.name = form.name;
  await targetInstance.save();

  return {
    success: true,
    message: 'Feedback Target Successfully Updated',
    content: targetInstance,
  };
};

const deleteFeedbackTarget = async (id) => {
  const targetInstance = await REF_FeedbackTarget.findByPk(id);
  if (!targetInstance) {
    return {
      success: false,
      code: 404,
      message: 'Feedback Type Data Not Found',
    };
  }

  const { name } = targetInstance.dataValues;

  await targetInstance.destroy();

  return {
    success: true,
    message: 'Feedback Target Successfully Deleted',
    content: `Feedback Target ${name} Successfully Deleted`,
  };
};

const selectAllFeedbackStatuses = async () => {
  const data = await REF_FeedbackStatus.findAll();

  return {
    success: true,
    message: 'Successfully Getting All Feedback Status',
    content: data,
  };
};

const selectFeedbackStatus = async (id) => {
  const statusInstance = await REF_FeedbackStatus.findByPk(id);
  if (!statusInstance) {
    return {
      success: false,
      code: 404,
      message: 'Feedback Status Data Not Found',
    };
  }

  return {
    success: true,
    message: 'Successfully Getting Feedback Status',
    content: statusInstance,
  };
};

const createFeedbackStatus = async (form) => {
  const statusInstance = await REF_FeedbackStatus.create({ name: form.name });

  return {
    success: true,
    message: 'Feedback Status Successfully Created',
    content: statusInstance,
  };
};

const updateFeedbackStatus = async (form, id) => {
  const statusInstance = await REF_FeedbackStatus.findByPk(id);
  if (!statusInstance) {
    return {
      success: false,
      code: 404,
      message: 'Feedback Status Data Not Found',
    };
  }

  statusInstance.name = form.name;
  await statusInstance.save();

  return {
    success: true,
    message: 'Feedback Status Successfully Updated',
    content: statusInstance,
  };
};

const deleteFeedbackStatus = async (id) => {
  const statusInstance = await REF_FeedbackStatus.findByPk(id);
  if (!statusInstance) {
    return {
      success: false,
      code: 404,
      message: 'Feedback Status Data Not Found',
    };
  }

  const { name } = statusInstance.dataValues;

  await statusInstance.destroy();

  return {
    success: true,
    message: 'Feedback Status Successfully Deleted',
    content: `Feedback Status ${name} Successfully Deleted`,
  };
};

const selectAllFAQTypes = async () => {
  const data = await REF_FAQType.findAll();

  return {
    success: true,
    message: 'Successfully Getting All FAQ Type',
    content: data,
  };
};

const selectFAQType = async (id) => {
  const typeInstance = await REF_FAQType.findByPk(id);
  if (!typeInstance) {
    return {
      success: false,
      code: 404,
      message: 'FAQ Type Data Not Found',
    };
  }

  return {
    success: true,
    message: 'Successfully Getting FAQ Type',
    content: typeInstance,
  };
};

const createFAQType = async (form) => {
  const targetInstance = await REF_FAQType.create({ name: form.name });

  return {
    success: true,
    message: 'FAQ Type Successfully Created',
    content: targetInstance,
  };
};

const updateFAQType = async (form, id) => {
  const typeInstance = await REF_FAQType.findByPk(id);
  if (!typeInstance) {
    return {
      success: false,
      code: 404,
      message: 'FAQ Type Data Not Found',
    };
  }

  typeInstance.name = form.name;
  await typeInstance.save();

  return {
    success: true,
    message: 'FAQ Type Successfully Updated',
    content: typeInstance,
  };
};

const deleteFAQType = async (id) => {
  const typeInstance = await REF_FAQType.findByPk(id);
  if (!typeInstance) {
    return {
      success: false,
      code: 404,
      message: 'FAQ Type Data Not Found',
    };
  }

  const { name } = typeInstance.dataValues;

  await typeInstance.destroy();

  return {
    success: true,
    message: 'FAQ Type Successfully Deleted',
    content: `FAQ Type ${name} Successfully Deleted`,
  };
};

const selectAllTemplateCategories = async () => {
  const data = await REF_TemplateCategory.findAll();

  return {
    success: true,
    message: 'Successfully Getting All Template Category',
    content: data,
  };
};

const selectTemplateCategory = async (id) => {
  const categoryInstance = await REF_TemplateCategory.findByPk(id);
  if (!categoryInstance) {
    return {
      success: false,
      code: 404,
      message: 'Template Category Data Not Found',
    };
  }

  return {
    success: true,
    message: 'Successfully Getting Template Category',
    content: categoryInstance,
  };
};

const createTemplateCategory = async (form) => {
  const categoryInstance = await REF_TemplateCategory.create({ name: form.name });

  return {
    success: true,
    message: 'Template Category Successfully Created',
    content: categoryInstance,
  };
};

const updateTemplateCategory = async (form, id) => {
  const categoryInstance = await REF_TemplateCategory.findByPk(id);
  if (!categoryInstance) {
    return {
      success: false,
      code: 404,
      message: 'Template Category Data Not Found',
    };
  }

  categoryInstance.name = form.name;
  await categoryInstance.save();

  return {
    success: true,
    message: 'Template Category Successfully Updated',
    content: categoryInstance,
  };
};

const deleteTemplateCategory = async (id) => {
  const categoryInstance = await REF_TemplateCategory.findByPk(id);
  if (!categoryInstance) {
    return {
      success: false,
      code: 404,
      message: 'Template Category Data Not Found',
    };
  }

  const { name } = categoryInstance.dataValues;

  await categoryInstance.destroy();

  return {
    success: true,
    message: 'Template Category Successfully Deleted',
    content: `Template Category ${name} Successfully Deleted`,
  };
};

const selectAllMetaTemplateCategories = async () => {
  const data = await REF_MetaTemplateCategory.findAll();

  return {
    success: true,
    message: 'Successfully Getting All Meta Template Category',
    content: data,
  };
};

const selectMetaTemplateCategory = async (id) => {
  const categoryInstance = await REF_MetaTemplateCategory.findByPk(id);
  if (!categoryInstance) {
    return {
      success: false,
      code: 404,
      message: 'Meta Template Category Data Not Found',
    };
  }

  return {
    success: true,
    message: 'Successfully Getting Meta Template Category',
    content: categoryInstance,
  };
};

const createMetaTemplateCategory = async (form) => {
  const categoryInstance = await REF_MetaTemplateCategory.create({ name: form.name });

  return {
    success: true,
    message: 'Meta Template Category Successfully Created',
    content: categoryInstance,
  };
};

const updateMetaTemplateCategory = async (form, id) => {
  const categoryInstance = await REF_MetaTemplateCategory.findByPk(id);
  if (!categoryInstance) {
    return {
      success: false,
      code: 404,
      message: 'Meta Template Category Data Not Found',
    };
  }

  categoryInstance.name = form.name;
  await categoryInstance.save();

  return {
    success: true,
    message: 'Meta Template Category Successfully Updated',
    content: categoryInstance,
  };
};

const deleteMetaTemplateCategory = async (id) => {
  const categoryInstance = await REF_MetaTemplateCategory.findByPk(id);
  if (!categoryInstance) {
    return {
      success: false,
      code: 404,
      message: 'Meta Template Category Data Not Found',
    };
  }

  const { name } = categoryInstance.dataValues;

  await categoryInstance.destroy();

  return {
    success: true,
    message: 'Meta Template Category Successfully Deleted',
    content: `Meta Template Category ${name} Successfully Deleted`,
  };
};

const selectAllTemplateHeaderTypes = async () => {
  const data = await REF_TemplateHeaderType.findAll();

  return {
    success: true,
    message: 'Successfully Getting All Template Header Type',
    content: data,
  };
};

const selectTemplateHeaderType = async (id) => {
  const typeInstance = await REF_TemplateHeaderType.findByPk(id);
  if (!typeInstance) {
    return {
      success: false,
      code: 404,
      message: 'Template Header Type Data Not Found',
    };
  }

  return {
    succcess: true,
    message: 'Successfully Getting Template Header Type',
    content: typeInstance,
  };
};

const createTemplateHeaderType = async (form) => {
  const typeInstance = await REF_TemplateHeaderType.create({ name: form.name });

  return {
    success: true,
    message: 'Template Header Type Successfully Created',
    content: typeInstance,
  };
};

const updateTemplateHeaderType = async (form, id) => {
  const typeInstance = await REF_TemplateHeaderType.findByPk(id);
  if (!typeInstance) {
    return {
      success: false,
      code: 404,
      message: 'Template Header Type Data Not Found',
    };
  }

  typeInstance.name = form.name;
  await typeInstance.save();

  return {
    success: true,
    message: 'Template Header Type Successfully Updated',
    content: typeInstance,
  };
};

const deleteTemplateHeaderType = async (id) => {
  const typeInstance = await REF_TemplateHeaderType.findByPk(id);
  if (!typeInstance) {
    return {
      success: false,
      code: 404,
      message: 'Template Header Type Data Not Found',
    };
  }

  const { name } = typeInstance.dataValues;

  await typeInstance.destroy();

  return {
    success: true,
    message: 'Template Header Type Successfully Deleted',
    content: `Template Header Type ${name} Successfully Deleted`,
  };
};

const selectAllInformationCenterTargetTypes = async () => {
  const data = await REF_InformationCenterTargetType.findAll();

  return {
    success: true,
    message: 'Successfully Getting All Information Center Target',
    content: data,
  };
};

const selectInformationCenterTargetType = async (id) => {
  const targetInstance = await REF_InformationCenterTargetType.findByPk(id);
  if (!targetInstance) {
    return {
      succcess: false,
      code: 404,
      message: 'Information Center Target Data Not Found',
    };
  }

  return {
    success: true,
    message: 'Successfully Getting Information Center Target',
    content: targetInstance,
  };
};

const createInformationCenterTargetType = async (form) => {
  const targetInstance = await REF_InformationCenterTargetType.create({ name: form.name });

  return {
    success: true,
    message: 'Information Center Target Successfully Created',
    content: targetInstance,
  };
};

const updateInformationCenterTargetType = async (form, id) => {
  const targetInstance = await REF_InformationCenterTargetType.findByPk(id);
  if (!targetInstance) {
    return {
      succcess: false,
      code: 404,
      message: 'Information Center Target Data Not Found',
    };
  }

  targetInstance.name = form.name;
  await targetInstance.save();

  return {
    success: true,
    message: 'Information Center Target Successfully Updated',
    content: targetInstance,
  };
};

const deleteInformationCenterTargetType = async (id) => {
  const targetInstance = await REF_InformationCenterTargetType.findByPk(id);
  if (!targetInstance) {
    return {
      succcess: false,
      code: 404,
      message: 'Information Center Target Data Not Found',
    };
  }

  const { name } = targetInstance.dataValues;
  await targetInstance.destroy();

  return {
    success: true,
    message: 'Information Center Target Successfully Deleted',
    content: `Information Center Target ${name} Successfully Deleted`,
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
  locationType: {
    selectAllLocationTypes,
    selectLocationType,
    createLocationType,
    updateLocationType,
    deleteLocationType,
  },
  chatbotResponseType: {
    selectAllChatbotResponseTypes,
    selectChatbotResponsetype,
    createChatbotResponseType,
    updateChatbotResponseType,
    deleteChatbotResponseType,
  },
  feedbackType: {
    selectAllFeedbackTypes,
    selectFeedbackType,
    createFeedbackType,
    updateFeedbackType,
    deleteFeedbackType,
  },
  feedbackTarget: {
    selectAllFeedbackTargets,
    selectFeedbackTarget,
    createFeedbackTarget,
    updateFeedbackTarget,
    deleteFeedbackTarget,
  },
  feedbackStatus: {
    selectAllFeedbackStatuses,
    selectFeedbackStatus,
    createFeedbackStatus,
    updateFeedbackStatus,
    deleteFeedbackStatus,
  },
  faqType: {
    selectAllFAQTypes,
    selectFAQType,
    createFAQType,
    updateFAQType,
    deleteFAQType,
  },
  templateCategory: {
    selectAllTemplateCategories,
    selectTemplateCategory,
    createTemplateCategory,
    updateTemplateCategory,
    deleteTemplateCategory,
  },
  metaTemplateCategory: {
    selectAllMetaTemplateCategories,
    selectMetaTemplateCategory,
    createMetaTemplateCategory,
    updateMetaTemplateCategory,
    deleteMetaTemplateCategory,
  },
  templateHeaderType: {
    selectAllTemplateHeaderTypes,
    selectTemplateHeaderType,
    createTemplateHeaderType,
    updateTemplateHeaderType,
    deleteTemplateHeaderType,
  },
  informationCenterTargetType: {
    selectAllInformationCenterTargetTypes,
    selectInformationCenterTargetType,
    createInformationCenterTargetType,
    updateInformationCenterTargetType,
    deleteInformationCenterTargetType,
  },
};
