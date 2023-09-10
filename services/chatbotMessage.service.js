const {
  CSM_Conversation, CSM_BroadcastParticipant, CSM_FAQ, CSM_ChatbotResponse, REF_ChatBotResponseType,
  SYS_Configuration, REF_FAQType,
} = require('../models');
const { metaSendMessage } = require('./whatsapp.integration.service');

const botData = async (
  phone_number,
  menuName = null,
  menuMessage = null,
  menuList = null,
  message = null,
) => {
  let data;
  if (menuList && menuName && menuMessage) {
    const row = [];
    menuList.forEach((list, index) => {
      const menu = list.name || list.keyword || list.menu;
      if (menu.length > 24) {
        const title = `Pilihan ${index + 1}`;
        row.push({ id: list.id, title, description: menu });
      } else {
        row.push({ id: list.id, title: menu });
      }
    });

    data = {
      messaging_product: 'whatsapp',
      to: phone_number,
      type: 'interactive',
      interactive: {
        type: 'list',
        body: {
          text: menuMessage,
        },
        action: {
          button: menuName,
          sections: [
            {
              rows: row,
            },
          ],
        },
      },
    };
  } else if (message) {
    data = {
      messaging_product: 'whatsapp',
      to: phone_number,
      text: { body: message, preview_url: true },
    };
  }

  return data;
};

const sendInvalidMessage = async (content) => {
  const { phone_number_id } = content.metadata;
  const { from } = content.messages[0];
  const { name } = content.contacts[0].profile;

  const messageResponse = await CSM_ChatbotResponse.findOne({
    where: { isActive: true },
    include: {
      model: REF_ChatBotResponseType,
      as: 'type',
      where: { name: 'Invalid' },
    },
  });

  let { message } = messageResponse;
  // replace value for dynamic variable in message body
  if (message.includes('{{username}}')) {
    message = message.replace('{{username}}', `${name}`);
  }
  if (message.includes('{{phone_number}}')) {
    message = message.replace('{{phone_number}}', `+${from}`);
  }

  const data = await botData(from, null, null, null, message);

  const token = await SYS_Configuration.findOne({ where: { name: 'Whatsapp Access Token' } });

  await metaSendMessage(data, phone_number_id, token.value);
};

const sendRestartMessage = async (content) => {
  const { phone_number_id } = content.metadata;
  const { from } = content.messages[0];
  const { name } = content.contacts[0].profile;

  const messageResponse = await CSM_ChatbotResponse.findOne({
    where: { isActive: true },
    include: {
      model: REF_ChatBotResponseType,
      as: 'type',
      where: { name: 'Restart' },
    },
  });

  let { message } = messageResponse;
  // replace value for dynamic variable in message body
  if (message.includes('{{username}}')) {
    message = message.replace('{{username}}', `${name}`);
  }
  if (message.includes('{{phone_number}}')) {
    message = message.replace('{{phone_number}}', `+${from}`);
  }

  const data = await botData(from, null, null, null, message);

  const token = await SYS_Configuration.findOne({ where: { name: 'Whatsapp Access Token' } });

  await metaSendMessage(data, phone_number_id, token.value);
};

const sendWelcomeMessage = async (content) => {
  const { phone_number_id } = content.metadata;
  const { from } = content.messages[0];
  const { name } = content.contacts[0].profile;

  const messageResponse = await CSM_ChatbotResponse.findOne({
    where: { isActive: true },
    include: {
      model: REF_ChatBotResponseType,
      as: 'type',
      where: { name: 'Welcome' },
    },
  });

  let { message } = messageResponse;
  // replace value for dynamic variable in message body
  if (message.includes('{{username}}')) {
    message = message.replace('{{username}}', `${name}`);
  }
  if (message.includes('{{phone_number}}')) {
    message = message.replace('{{phone_number}}', `+${from}`);
  }

  const data = await botData(from, null, null, null, message);

  const token = await SYS_Configuration.findOne({ where: { name: 'Whatsapp Access Token' } });

  await metaSendMessage(data, phone_number_id, token.value);
};

const sendMenu = async (content) => {
  const { phone_number_id } = content.metadata;
  const { from } = content.messages[0];

  let data;

  const menuType = await REF_FAQType.findAll({ attributes: ['id', 'name'] });

  let mainMenu = true;
  if (content.messages[0].type === 'interactive') {
    menuType.forEach(async (menu) => {
      if (content.messages[0].interactive.list_reply.id.includes(`Main-${menu.id}`)) {
        const title = content.messages[0].interactive.list_reply.id;
        mainMenu = false;
        const menus = await CSM_FAQ.findAll({ where: { parentFAQId: menu.id } });

        const menuList = menus.map((choice) => ({ id: `Sub-${choice.id}-${choice.title}`, menu: choice.title }));
        data = await botData(from, 'Choose Information', `Choose ${title.split('-')[2]} Information You Wish To Know`, menuList);

        const token = await SYS_Configuration.findOne({ where: { name: 'Whatsapp Access Token' } });
        await metaSendMessage(data, phone_number_id, token.value);
        return null;
      }
    });

    if (content.messages[0].interactive.list_reply.id.includes('Sub')) {
      const title = content.messages[0].interactive.list_reply.id;
      mainMenu = false;
      const menus = await CSM_FAQ.findAll({ where: { parentFAQId: title.split('-')[1] } });

      const menuList = menus.map((choice) => ({ id: `Sub-${choice.id}-${choice.title}`, menu: choice.title }));
      data = await botData(from, 'Choose Information', `Choose ${title.split('-')[2]} Information You Wish To Know`, menuList);

      const token = await SYS_Configuration.findOne({ where: { name: 'Whatsapp Access Token' } });
      await metaSendMessage(data, phone_number_id, token.value);
      return null;
    }
  }

  if (mainMenu) {
    const menu = await CSM_FAQ.findAll({ where: { isMain: true } });

    const menuList = menu.map((choice) => ({ id: `Main-${choice.id}-${choice.title}`, menu: choice.title }));
    data = await botData(from, 'Choose Main Menu', 'Choose Information You Wish To Know', menuList);

    const token = await SYS_Configuration.findOne({ where: { name: 'Whatsapp Access Token' } });
    await metaSendMessage(data, phone_number_id, token.value);
    return null;
  }
};

const sendFaq = async (content, faqInstance) => {
  const { phone_number_id } = content.metadata;
  const { from } = content.messages[0];
  const data = await botData(from, null, null, null, faqInstance?.message);

  const token = await SYS_Configuration.findOne({ where: { name: 'Whatsapp Access Token' } });
  await metaSendMessage(data, phone_number_id, token.value);
};

const chatBotMessageEntry = async (content) => {
  if (content.messages) {
    // Recieve message form user / customer / participant via whatsapp

    const conversationInstance = await CSM_Conversation.findOne({
      where: { phoneNbr: content.messages[0].from },
    });

    if (content.messages[0].type === 'text') {
      // user / customer / participant send free form messages

      if (conversationInstance) {
        // check if converstation is more than minimum for restarting the converstation
        const whatsappConversationLimitHours = await SYS_Configuration.findOne({ where: { name: 'Whatsapp Converstation Limit Hours' } });
        const limitHoursAgo = new Date(
          Date.now() - Number(whatsappConversationLimitHours.value) * 60 * 60 * 1000,
        ).getTime();

        const isOverLimit = new Date(conversationInstance.timeStamp).getTime() < limitHoursAgo;

        const mainMenuKeyWord = await SYS_Configuration.findOne({ where: { name: 'Whatsapp Menu Keyword' } });

        if (isOverLimit) {
          // send welcome message and menu message
          await sendWelcomeMessage(content);
          await sendMenu(content);
        } else if (
          content.messages[0].text.body.toLowerCase() === mainMenuKeyWord.value.toLowerCase()) {
          await sendMenu(content);
        } else {
          await sendInvalidMessage(content);
        }
      } else {
        // send welcome message and menu message
        await sendWelcomeMessage(content);
        await sendMenu(content);
      }
    } else if (content.messages[0].type === 'interactive') {
      // user / customer / participant send interactive messages
      const faqId = content.messages[0].interactive.list_reply.id.split('-')[1];
      const faqInstance = await CSM_FAQ.findByPk(faqId);

      if (faqInstance?.message) {
        await sendFaq(content, faqInstance);
        await sendRestartMessage(content);
      } else if (faqInstance) {
        await sendMenu(content);
      }
    }

    if (conversationInstance) {
      conversationInstance.timeStamp = new Date();
      await conversationInstance.save();
    } else {
      await CSM_Conversation.create({
        name: content.contacts[0].profile.name,
        phoneNbr: content.messages[0].from,
        timeStamp: new Date(),
      });
    }
  } else if (content.statuses) {
    // Recieve update about message we sent to user / customer participant via whatsapp
    const { id, status } = content.statuses[0];

    const messageInstance = await CSM_BroadcastParticipant.findOne({ where: { metaId: id } });

    if (messageInstance) {
      messageInstance.status = status;
      await messageInstance.save();
      return null;
    }
  }
};

module.exports = {
  chatBotMessageEntry,
};
