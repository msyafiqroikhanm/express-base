/* eslint-disable no-param-reassign */
const util = require('util');
const { relative } = require('path');
const { Op } = require('sequelize');
const cron = require('node-schedule');
const {
  CSM_Broadcast, CSM_BroadcastTemplate, PAR_Participant, PAR_Contingent, REF_Region,
  CSM_BroadcastParticipant, REF_MetaTemplateLanguage, REF_TemplateHeaderType,
  SYS_Configuration,
} = require('../models');
const {
  formatWhatsappMessage, metaSendMessage,
} = require('./whatsapp.integration.service');
const deleteFile = require('../helpers/deleteFile.helper');

const setTimeoutPromise = util.promisify(setTimeout);

const selectAllBroadcasts = async () => {
  const data = await CSM_Broadcast.findAll({
    include: [
      { model: CSM_BroadcastTemplate, attributes: ['name'], as: 'template' },
    ],
  });

  // parsed content data
  data.forEach((broadcast) => {
    broadcast.dataValues.template = broadcast.template.dataValues.name;
  });

  return {
    success: true,
    message: 'Successfully Getting All Broadcast',
    content: data,
  };
};

const selectBroadcast = async (id) => {
  const broadcastInstance = await CSM_Broadcast.findByPk(id, {
    include: [
      { model: CSM_BroadcastTemplate, attributes: ['name'], as: 'template' },
      {
        model: PAR_Participant,
        as: 'receivers',
        attributes: ['id', 'name', 'phoneNbr'],
        through: { attributes: ['status'] },
        include: [
          {
            model: PAR_Contingent,
            as: 'contingent',
            attributes: ['name'],
            include: { model: REF_Region, as: 'region', attributes: ['name'] },
          },
        ],
      },
    ],
  });

  if (!broadcastInstance) {
    return {
      success: false,
      code: 404,
      message: ['Broadcast Type Data Not Found'],
    };
  }

  // parse content data
  const receiversList = [];
  broadcastInstance.receivers.forEach((receiver) => {
    receiversList.push(receiver.dataValues.id);
    receiver.dataValues.region = receiver.contingent?.region.dataValues.name;
    receiver.dataValues.contingent = receiver.contingent?.dataValues.name;
    receiver.dataValues.status = receiver.CSM_BroadcastParticipant.dataValues.status;

    delete receiver.dataValues.CSM_BroadcastParticipant;
  });
  broadcastInstance.dataValues.receiversList = receiversList;

  return {
    success: true,
    message: 'Successfully Getting Broadcast',
    content: broadcastInstance,
  };
};

const validateBroadcastInputs = async (form, file) => {
  const invalid400 = [];
  const invalid404 = [];

  // prevent backdate
  if (new Date().getTime() > new Date(form.sentAt)) {
    invalid400.push('Send at date must be after created date');
  }

  const templateInstance = await CSM_BroadcastTemplate.findByPk(form.templateId, {
    include: [
      { model: REF_TemplateHeaderType, as: 'headerType', attributes: ['name'] },
    ],
  });
  if (!templateInstance) {
    invalid404.push('Broadcast Template Data Not Found');
  }
  if (templateInstance?.metaStatus !== 'APPROVED') {
    invalid400.push('Cannot Used Unapproved Message Template To Send Broadcast');
  }

  // * Validate Header
  let headerFile = null;
  if (['IMAGE', 'VIDEO', 'DOCUMENT'].includes(templateInstance?.headerType.name)) {
    if (!file) {
      invalid400.push(`Broadcast Using Template With Header ${templateInstance?.headerType.name} Required File`);
    }
    if (['jpeg', 'png', 'jpg'].includes(file.originalname.split('.')[1])) {
      headerFile = `public/images/broadcasts/${file.filename}`;
    } else if (['mp4', '3gp'].includes(file.originalname.split('.')[1])) {
      headerFile = `public/videos/broadcasts/${file.filename}`;
    } else if (['pdf', 'docx', 'xlsx'].includes(file.originalname.split('.')[1])) {
      headerFile = `public/documents/broadcasts/${file.filename}`;
    }
  } else if (templateInstance?.headerType.name === 'TEXT' && templateInstance?.headerVariableExample) {
    if (!form.headerText) {
      invalid400.push('Broadcast Using Template With Header Type Text And Header Variable, Required Header Text');
    }
  }

  // * Validate Message
  if (templateInstance?.messageVariableNumber > 1) {
    if (templateInstance?.messageVariableNumber !== form.messageParameters?.length) {
      invalid400.push(`Message Parameters Required ${templateInstance?.messageVariableNumber} For Chosen Broadcast Template`);
    }
  } else if (form.messageParameters) {
    invalid400.push('Broadcast Template With Static Message Cannot Have Paramters');
  }

  // * Validate Button
  if (templateInstance?.button?.length > 0
      && form.buttonParameters?.length !== templateInstance?.button?.length) {
    invalid400.push(`Button Parameters Required ${templateInstance?.button?.length} For Chosen Broadcast Template`);
  }

  // validate Recipiants / receivers
  const validReceivers = await PAR_Participant.findAll({
    where: {
      id: { [Op.in]: form.receivers },
    },
  });

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
      template: templateInstance,
      name: form.name,
      sentAt: new Date(form.sentAt),
      messageParameters: form.messageParameters,
      buttonParameters: form.buttonParameters,
      headerFile,
      headerText: form.headerText,
      description: form.description,
      receivers: validReceivers,
    },
  };
};

const createBroadcast = async (form) => {
  const broadcastInstance = await CSM_Broadcast.create({
    templateId: form.template.id,
    name: form.name,
    status: 'Scheduled',
    sentAt: form.sentAt,
    messageParameters: form.messageParameters,
    buttonParameters: form.buttonParameters,
    headerFile: form.headerFile,
    headerText: form.headerText,
    description: form.description,
  });

  await broadcastInstance.addReceivers(form.receivers);

  return {
    success: true,
    message: 'Broadcast Successfully Created',
    content: broadcastInstance,
  };
};

const scheduleBroadcast = async (broadcastId) => {
  const receivers = await CSM_BroadcastParticipant.findAll({
    where: { broadcastId },
    include: {
      model: PAR_Participant,
    },
  });

  const broadcastInstance = await CSM_Broadcast.findByPk(broadcastId, {
    include: {
      model: CSM_BroadcastTemplate,
      as: 'template',
      attributes: ['name'],
      include: { model: REF_MetaTemplateLanguage, as: 'language', attributes: ['value'] },
    },
  });

  const BASE_URL = await SYS_Configuration.findOne({ where: { name: 'Base URL' } });
  const WhatsappAccessToken = await SYS_Configuration.findOne({ where: { name: 'Whatsapp Access Token' } });
  const WhatsappPhoneId = await SYS_Configuration.findOne({ where: { name: 'Whatsapp Phone Id' } });

  const components = formatWhatsappMessage(broadcastInstance, BASE_URL.value);

  // when a broadcast approve / scheduled after sentAt time
  // reassign sentAt as current time
  let date = new Date(broadcastInstance.sentAt);
  if (date.getTime() < new Date().getTime()) {
    date = new Date();
    console.log(`Broadcast scheduled in the past ${date}`);
  }

  cron.scheduleJob(`${broadcastInstance.id}`, date, async () => {
    console.log(`message send at ${new Date()}`);

    receivers.forEach(async (receiver, index) => {
      try {
        const messageData = {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: receiver.PAR_Participant.phoneNbr.replace('+', ''),
          type: 'template',
          template: {
            name: broadcastInstance.template.name,
            language: {
              code: broadcastInstance.template.language.value,
            },
            components,
          },
        };

        const metaResponse = await metaSendMessage(
          messageData,
          WhatsappPhoneId.value,
          WhatsappAccessToken.value,
        );

        if (metaResponse.status === 200) {
        // set message status as success
          receiver.meta_id = metaResponse.data.messages[0].id;
          await receiver.save();
        }

        if ((index + 1) % 30 === 0) {
          // Pause for 2 seconds using setTimeout
          await setTimeoutPromise(2000);
        }
      } catch (error) {
        console.error('Error sending message to employee:', error);
      }
    });

    broadcastInstance.status = 'Sent';
    await broadcastInstance.save();
    cron.cancelJob(`${broadcastInstance.id}`);
  });
};

const updateBroadcast = async (form, id) => {
  const broadcastInstance = await CSM_Broadcast.findByPk(id);
  if (!broadcastInstance) {
    return {
      success: false,
      code: 404,
      message: ['Broadcast Type Data Not Found'],
    };
  }
  if (broadcastInstance.status !== 'Scheduled') {
    return {
      success: false,
      code: 400,
      message: ['Only Broadcast With Status Scheduled Can Be Editted'],
    };
  }

  cron.cancelJob(`${broadcastInstance.id}`);

  // delete old file
  await deleteFile(relative(__dirname, broadcastInstance.headerFile));

  broadcastInstance.templateId = form.template.id;
  broadcastInstance.name = form.name;
  broadcastInstance.status = 'Scheduled';
  broadcastInstance.sentAt = form.sentAt;
  broadcastInstance.messageParameters = form.messageParameters;
  broadcastInstance.buttonParameters = form.buttonParameters;
  broadcastInstance.headerFile = form.headerFile;
  broadcastInstance.headerText = form.headerText;
  broadcastInstance.description = form.description;
  await broadcastInstance.save();

  await broadcastInstance.setReceivers(form.receivers);

  return {
    success: true,
    message: 'Broadcast Successfully Updated',
    content: broadcastInstance,
  };
};

const deleteBroadcast = async (id) => {
  const broadcastInstance = await CSM_Broadcast.findByPk(id);
  if (!broadcastInstance) {
    return {
      success: false,
      code: 404,
      message: ['Broadcast Type Data Not Found'],
    };
  }
  if (broadcastInstance.status !== 'Scheduled') {
    return {
      success: false,
      code: 400,
      message: ['Only Broadcast With Status Scheduled Can Be Deleted'],
    };
  }

  cron.cancelJob(`${broadcastInstance.id}`);

  const { name } = broadcastInstance.dataValues;

  if (broadcastInstance.headerFile) {
    await deleteFile(relative(__dirname, broadcastInstance.headerFile));
  }

  await broadcastInstance.setReceivers([]);

  await broadcastInstance.destroy();

  return {
    success: true,
    message: 'Broadcast Successfully Deleted And Canceled',
    content: `Broadcast ${name} Successfully Deleted And Canceled`,
  };
};

module.exports = {
  validateBroadcastInputs,
  selectAllBroadcasts,
  selectBroadcast,
  createBroadcast,
  scheduleBroadcast,
  updateBroadcast,
  deleteBroadcast,
};
