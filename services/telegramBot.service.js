/* eslint-disable no-param-reassign */
const {
  CSM_TelegramConversation, CSM_ChatbotResponse, REF_ChatBotResponseType, CSM_FAQ,
  SYS_Configuration,
} = require('../models');

const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string

const sendTelegramWelcomeMessage = async (bot, message) => {
  const messageResponse = await CSM_ChatbotResponse.findOne({
    where: { isActive: true },
    include: {
      model: REF_ChatBotResponseType,
      as: 'type',
      where: { name: 'Welcome' },
    },
    attributes: ['message'],
  });

  let replyMessage = messageResponse.message;
  // replace value for dynamic variable in message body
  if (replyMessage.includes('{{username}}')) {
    replyMessage = replyMessage.replace('{{username}}', `${message.chat.first_name} ${message.chat.last_name}`);
  }
  if (replyMessage.includes('{{phone_number}}')) {
    replyMessage = replyMessage.replace('{{phone_number}}', '');
  }

  const symbols = ['[', ']', '(', ')', '`', '>', '#', '+', '-', '=', '|', '{', '}', '.', '!'];
  symbols.forEach((symbol) => {
    if (replyMessage.includes(symbol)) {
      replyMessage = replyMessage.replace(new RegExp(escapeRegExp(symbol), 'g'), `\\${symbol}`);
    }
  });

  bot.sendMessage(message.chat.id, replyMessage, { parse_mode: 'MarkdownV2' });
};

const sendTelegramMenu = async (bot, message, menuId) => {
  if (menuId) {
    const menu = await CSM_FAQ.findAll({ where: { parentFAQId: menuId } });
    const menuList = menu.map((choice) => ({ text: `🔹${choice.title}`, callback_data: choice.id }));

    const chosenMenu = await CSM_FAQ.findByPk(menuId, { attributes: ['title'] });
    bot.sendMessage(message.chat.id, `Choose Information About ${chosenMenu.title}, You Wish To Know`, {
      reply_markup: {
        inline_keyboard: [menuList],
      },
    });
  } else {
    const menu = await CSM_FAQ.findAll({ where: { isMain: true }, attributes: ['id', 'title'] });
    const menuList = menu.map((choice) => ({ text: `🔹${choice.title}`, callback_data: choice.id }));
    bot.sendMessage(message.chat.id, 'Choose Information You Wish To Know', {
      reply_markup: {
        inline_keyboard: [menuList],
      },
    });
  }
};

const sendTelegramFaq = async (bot, message, faqReply) => {
  const symbols = ['[', ']', '(', ')', '`', '>', '#', '+', '-', '=', '|', '{', '}', '.', '!'];
  symbols.forEach((symbol) => {
    if (faqReply.includes(symbol)) {
      faqReply = faqReply.replace(new RegExp(escapeRegExp(symbol), 'g'), `\\${symbol}`);
    }
  });

  bot.sendMessage(message.chat.id, faqReply, { parse_mode: 'MarkdownV2' });
};

const sendTelegramRestartMessage = async (bot, message) => {
  const messageResponse = await CSM_ChatbotResponse.findOne({
    where: { isActive: true },
    include: {
      model: REF_ChatBotResponseType,
      as: 'type',
      where: { name: 'Restart' },
    },
  });

  let replyMessage = messageResponse.message;
  // replace value for dynamic variable in message body
  if (replyMessage.includes('{{username}}')) {
    replyMessage = replyMessage.replace('{{username}}', `${message.chat.first_name} ${message.chat.last_name}`);
  }
  if (replyMessage.includes('{{phone_number}}')) {
    replyMessage = replyMessage.replace('{{phone_number}}', '');
  }

  // make dangerous symbol have escape symbol "\" before them
  const symbols = ['[', ']', '(', ')', '`', '>', '#', '+', '-', '=', '|', '{', '}', '.', '!'];
  symbols.forEach((symbol) => {
    if (replyMessage.includes(symbol)) {
      replyMessage = replyMessage.replace(new RegExp(escapeRegExp(symbol), 'g'), `\\${symbol}`);
    }
  });

  bot.sendMessage(message.chat.id, replyMessage, { parse_mode: 'MarkdownV2' });
};

const sendTelegramInvalidMessage = async (bot, message) => {
  const messageResponse = await CSM_ChatbotResponse.findOne({
    where: { isActive: true },
    include: {
      model: REF_ChatBotResponseType,
      as: 'type',
      where: { name: 'Invalid' },
    },
  });

  let replyMessage = messageResponse.message;
  // replace value for dynamic variable in message body
  if (replyMessage.includes('{{username}}')) {
    replyMessage = replyMessage.replace('{{username}}', `${message.chat.first_name} ${message.chat.last_name}`);
  }
  if (replyMessage.includes('{{phone_number}}')) {
    replyMessage = replyMessage.replace('{{phone_number}}', '');
  }

  const symbols = ['[', ']', '(', ')', '`', '>', '#', '+', '-', '=', '|', '{', '}', '.', '!'];
  symbols.forEach((symbol) => {
    if (replyMessage.includes(symbol)) {
      replyMessage = replyMessage.replace(new RegExp(escapeRegExp(symbol), 'g'), `\\${symbol}`);
    }
  });

  bot.sendMessage(message.chat.id, replyMessage, { parse_mode: 'MarkdownV2' });
};

const telegramChatBotMessageEntry = async (bot, message) => {
  const conversationInstance = await CSM_TelegramConversation.findOne({
    where: { chatId: message.chat.id },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });

  // check if user have chat with telegram chat bot before
  if (conversationInstance) {
    // check if converstation is more than minimum for restarting the converstation
    const telegramConversationLimitHours = await SYS_Configuration.findOne({ where: { name: 'Telegram Converstation Limit Hours' } });
    const limitHoursAgo = new Date(
      Date.now() - Number(telegramConversationLimitHours.value) * 60 * 60 * 1000,
    ).getTime();

    const isOverLimit = new Date(conversationInstance.timeStamp).getTime() < limitHoursAgo;

    const mainMenuKeyWord = await SYS_Configuration.findOne({ where: { name: 'Telegram Menu Keyword' } });

    conversationInstance.timeStamp = new Date();
    await conversationInstance.save();

    if (isOverLimit) {
      await sendTelegramWelcomeMessage(bot, message);
      await sendTelegramMenu(bot, message);
    } else if (message?.text?.toLowerCase() === mainMenuKeyWord.value.toLowerCase()) {
      await sendTelegramMenu(bot, message);
    } else {
      await sendTelegramInvalidMessage(bot, message);
    }
  } else {
    await CSM_TelegramConversation.create({
      name: `${message.chat.first_name} ${message.chat.last_name}`,
      chatId: message.chat.id,
      timeStamp: new Date(),
    });

    await sendTelegramWelcomeMessage(bot, message);
    await sendTelegramMenu(bot, message);
  }
};

const telegramMenuEntry = async (bot, message, menuId) => {
  // user / customer / participant send interactive messages
  const faqInstance = await CSM_FAQ.findByPk(menuId, { attributes: ['id', 'message'] });

  if (faqInstance?.message) {
    await sendTelegramFaq(bot, message, faqInstance.message).then(
      await sendTelegramRestartMessage(bot, message),
    );
    // await sendTelegramRestartMessage(bot, message);
  } else if (faqInstance) {
    await sendTelegramMenu(bot, message, menuId);
  }
};

module.exports = {
  telegramChatBotMessageEntry,
  telegramMenuEntry,
};
