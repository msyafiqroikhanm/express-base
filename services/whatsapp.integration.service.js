/* eslint-disable quote-props */
/* eslint-disable no-param-reassign */

const axios = require('axios');
const {
  SYS_Configuration, CSM_BroadcastTemplate,
} = require('../models');

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

const metaSendMessage = async (data, phoneId, accessToken) => {
  try {
    const metaResponse = await axios({
      method: 'POST', // Required, HTTP method, a string, e.g. POST, GET
      url:
        `https://graph.facebook.com/v17.0/${phoneId}/messages`,
      data,
      headers: {
        // eslint-disable-next-line quote-props
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    return metaResponse;
  } catch (error) {
    console.error(error.response.data);
    throw error.response.data;
  }
};

const formatWhatsappMessage = (data, BASE_URL) => {
  const components = [];

  // format header
  const headerComponent = {
    type: 'header',
    parameters: [{}],
  };
  if (data.headerFile) {
    const type = data?.headerFile.split('.')[1];
    if (['jpeg', 'png', 'jpg'].includes(type)) {
      headerComponent.parameters[0] = {
        type: 'image',
        image: {
          link: `${BASE_URL}/${data.headerFile}`,
        },
      };
    } else if (['mp4', '3gp'].includes(type)) {
      headerComponent.parameters[0] = {
        type: 'video',
        video: {
          link: `${BASE_URL}/${data.headerFile}`,
        },
      };
    } else if (['pdf', 'docx', 'xlsx'].includes(type)) {
      headerComponent.parameters[0] = {
        type: 'document',
        document: {
          link: `${BASE_URL}/${data.headerFile}`,
        },
      };
    }
    components.push(headerComponent);
  } else if (data.headerText) {
    headerComponent.parameters[0] = {
      type: 'text',
      text: data.headerText,
    };
    components.push(headerComponent);
  }

  // format body
  if (data.messageParameters?.length > 0) {
    const body = [];

    if (typeof data.messageParameters === 'string') {
      data.messageParameters = JSON.parse(data.messageParameters);
    }
    data.messageParameters.forEach((parameter) => {
      body.push({
        type: 'text',
        text: parameter,
      });
    });

    components.push({
      type: 'body',
      parameters: body,
    });
  }

  // format button
  if (data.buttonParameters) {
    if (typeof data.buttonParameters === 'string') {
      data.buttonParameters = JSON.parse(data.buttonParameters);
    }
    data.buttonParameters.forEach((parameter, index) => {
      if (parameter.type === 'payload') {
        components.push(
          {
            type: 'button',
            sub_type: 'quick_reply',
            index,
            parameters: [
              parameter,
            ],
          },
        );
      } else {
        components.push(
          {
            type: 'button',
            sub_type: 'call_to_action',
            index,
            parameters: [
              parameter,
            ],
          },
        );
      }
    });
  }
  return components;
};

module.exports = {
  metaWebhookTemplateStatusUpdate,
  updateMetaWhatsappTemplate,
  deleteMetaWhatsappTemplate,
  registerWhatsappTemplate,
  metaMediaHandler,
  formatWhatsappMessage,
  metaSendMessage,
};
