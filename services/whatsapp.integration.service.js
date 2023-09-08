/* eslint-disable quote-props */
const axios = require('axios');
const { SYS_Configuration, CSM_BroadcastTemplate } = require('../models');

const registerWhatsappTemplate = async (metaTemplate) => {
  const WhatsappAccountId = await SYS_Configuration.findOne({ where: { name: 'Whatsapp Account Id' } });
  const WhatsappAccessToken = await SYS_Configuration.findOne({ where: { name: 'Whatsapp Access Token' } });

  let metaResponse;
  try {
    metaResponse = await axios({
      method: 'POST',
      url: `https://graph.facebook.com/v17.0/${WhatsappAccountId.value}/message_templates`,
      headers: {
        // eslint-disable-next-line quote-props
        'Authorization': `Bearer ${WhatsappAccessToken.value}`,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(metaTemplate),
    });
  } catch (error) {
    console.log(error.response.data);
    return {
      success: false,
      message: error.response.data.error,
    };
  }

  if (metaResponse.status !== 200) {
    return {
      success: false,
      code: 400,
      message: 'Failed To Register Broadcast Template At Meta Service, Please Review The Template And Resubmit',
    };
  }
  return { success: true, metaResponse: metaResponse.data };
};

const updateMetaWhatsappTemplate = async (components, id) => {
  // check whatsapp / template status is allowed to be editted
  const templateInstance = await CSM_BroadcastTemplate.findByPk(id);
  if (!templateInstance) {
    return {
      success: false,
      code: 404,
      message: 'Broadcast Template Data Not Found',
    };
  }
  if (!['APPROVED', 'REJECTED', 'PAUSED'].includes(templateInstance.metaStatus)) {
    return {
      success: false,
      code: 400,
      message: 'Only Broadcast Template With Meta Status [Approved, Rejected, And Paused] Allowed To Be Edited',
    };
  }

  const WhatsappAccessToken = await SYS_Configuration.findOne({ where: { name: 'Whatsapp Access Token' } });

  let metaResponse;
  try {
    metaResponse = await axios({
      method: 'POST',
      url: `https://graph.facebook.com/v17.0/${templateInstance.metaId}`,
      headers: {
        // eslint-disable-next-line quote-props
        'Authorization': `Bearer ${WhatsappAccessToken.value}`,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ components }),
    });
  } catch (error) {
    console.log(error.response.data);
    return {
      success: false,
      message: error.response.data.error,
    };
  }

  if (metaResponse.data.success !== true) {
    return {
      success: false,
      code: 400,
      message: 'Failed To Update Broadcast Template At Meta Service, Please Review The Template And Resubmit',
    };
  }

  return { success: true };
};

const deleteMetaWhatsappTemplate = async (id) => {
  // check whatsapp / template status is allowed to be editted
  const templateInstance = await CSM_BroadcastTemplate.findByPk(id);
  if (!templateInstance) {
    return {
      success: false,
      code: 404,
      message: 'Broadcast Template Data Not Found',
    };
  }

  // todo Make condition to prohibit deleting template when have broadcast in scheduled status

  const WhatsappAccountId = await SYS_Configuration.findOne({ where: { name: 'Whatsapp Account Id' } });
  const WhatsappAccessToken = await SYS_Configuration.findOne({ where: { name: 'Whatsapp Access Token' } });

  let metaResponse;
  try {
    metaResponse = await axios({
      method: 'DELETE',
      url: `https://graph.facebook.com/v17.0/${WhatsappAccountId.value}/message_templates?name=${templateInstance.name}`,
      headers: {
        // eslint-disable-next-line quote-props
        'Authorization': `Bearer ${WhatsappAccessToken.value}`,
      },
    });
  } catch (error) {
    console.log(error.response.data);
    return {
      success: false,
      message: error.response.data.error,
    };
  }

  if (metaResponse.data.success !== true) {
    return {
      success: false,
      code: 400,
      message: 'Failed To Delete Broadcast Template At Meta Service, Please Review The Template And Resubmit',
    };
  }

  return { success: true };
};

const metaMediaHandler = async (file) => {
  try {
    const WhatsappAppId = await SYS_Configuration.findOne({ where: { name: 'Whatsapp App Id' } });
    const WhatsappAccessToken = await SYS_Configuration.findOne({ where: { name: 'Whatsapp Access Token' } });

    // create upload session
    const metaSessionResponse = await axios({
      method: 'POST',
      url: `https://graph.facebook.com/v17.0/${WhatsappAppId.value}/uploads`,
      params: {
        file_length: file.size,
        file_type: file.mimetype,
      },
      headers: {
        'Authorization': `Bearer ${WhatsappAccessToken.value}`,
      },
    });

    const { id } = metaSessionResponse.data;

    // upload the file
    const metaUploadResponse = await axios.post(`https://graph.facebook.com/v17.0/${id}`, file.buffer, {
      headers: {
        Authorization: `OAuth ${WhatsappAccessToken.value}`,
        'file_offset': 0,
        'Content-Type': 'application/octet-stream',
      },
    });

    return metaUploadResponse.data.h;
  } catch (error) {
    console.error(error.response.data);
    throw error;
  }
};

const metaWebhookTemplateStatusUpdate = async (metaId, status) => {
  const templateInstance = await CSM_BroadcastTemplate.findOne({ where: { metaId } });

  if (templateInstance && status === 'PENDING_DELETION') {
    // todo make appriopriate action to delete template and broadcast (or set null)
  } else if (templateInstance) {
    templateInstance.metaStatus = status;
    await templateInstance.save();
    console.log(`Success Changin Status into ${status}`);
    return true;
  }
  return false;
};

module.exports = {
  metaWebhookTemplateStatusUpdate,
  updateMetaWhatsappTemplate,
  deleteMetaWhatsappTemplate,
  registerWhatsappTemplate,
  metaMediaHandler,
};
