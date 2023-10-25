const { SYS_Configuration } = require('../models');
const { chatBotMessageEntry } = require('./chatbotMessage.service');
const { metaWebhookTemplateStatusUpdate } = require('./whatsapp.integration.service');

const verifyWebhook = async (query) => {
  const Token = await SYS_Configuration.findOne({ where: { name: 'Whatsapp Verify Token' } });
  // Parse params from the webhook verification request
  const mode = query['hub.mode'];
  const token = query['hub.verify_token'];
  const challenge = query['hub.challenge'];

  if (token === Token?.value && mode === 'subscribe') {
    return {
      success: true,
      content: challenge,
    };
  }

  return {
    success: false,
    content: null,
  };
};

const receiveWebhook = async (form) => {
  const Whatsapp_Status = await SYS_Configuration.findOne({
    where: { name: 'Whatsapp CSM Platform' }, attributes: ['value'],
  });

  if (form.object) {
    if (form.entry[0].changes[0].field === 'messages') {
      if (!Whatsapp_Status || Whatsapp_Status?.value?.toLowerCase() === 'off') {
        return true;
      }
      await chatBotMessageEntry(form.entry[0].changes[0].value);
      return true;
    }
    if (form.entry[0].changes[0].field === 'message_template_status_update') {
      // Check webhook request for template status update
      return metaWebhookTemplateStatusUpdate(
        form.entry[0].changes[0].value.message_template_id,
        form.entry[0].changes[0].value.event || 'PENDING',
      );
    }
    return true;
  }
  return true;
};

module.exports = {
  verifyWebhook,
  receiveWebhook,
};
