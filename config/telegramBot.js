const TelegramBot = require('node-telegram-bot-api');
const { SYS_Configuration } = require('../models');
const { telegramChatBotMessageEntry, telegramMenuEntry } = require('../services/telegramBot.service');

const initializeTelegramBot = async () => {
  const TELEGRAM_TOKEN = await SYS_Configuration.findOne({
    where: { name: 'Telegram Token' }, attributes: ['value'],
  });

  if (!TELEGRAM_TOKEN) {
    console.log('Missing Telegram Bot Token In System Configurations');
    return true;
  }

  const bot = new TelegramBot(TELEGRAM_TOKEN.value, { polling: true });

  bot.on('message', async (message) => {
    if (!message.from.is_bot) {
      const Telegram_Status = await SYS_Configuration.findOne({
        where: { name: 'Telegram CSM Platform' }, attributes: ['value'],
      });
      if (!Telegram_Status || Telegram_Status?.value?.toLowerCase() === 'off') {
        return true;
      }

      await telegramChatBotMessageEntry(bot, message);
    }
  });

  bot.on('callback_query', async (query) => {
    await telegramMenuEntry(bot, query.message, query.data);
  });
};

module.exports = {
  initializeTelegramBot,
};
