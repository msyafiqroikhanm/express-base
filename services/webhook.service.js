const { SYS_Configuration } = require('../models');

const verifyWebhook = async (query) => {
  const Token = await SYS_Configuration.findOne({ where: { name: 'Whatsapp Verify Token' } });
  console.log(JSON.stringify(Token, null, 2));
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
  if (form.object) {
    return true;
  }
  return false;
};

module.exports = {
  verifyWebhook,
  receiveWebhook,
};
