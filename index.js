const http = require('http');
const app = require('./app');
// const db = require('./models');
const { metaBroadcastSynchronize } = require('./config/cron');
const { initializeSocketIO } = require('./config/websocket');
const { initializeTelegramBot } = require('./config/telegramBot');

const port = process.env.PORT || 3000;
require('dotenv').config();

const server = http.createServer(app);

if (process.env.NODE_ENV !== 'test') {
  initializeSocketIO(server).then((io) => app.set('socketIo', io)); // initialize websocket

  initializeTelegramBot(); // initialize telegram chat bot
}

server.listen(port, async () => {
  // await db.sequelize.authenticate();
  console.log(
    `${process.env.APP_NAME} running on  url: ${
      process.env.BASE_URL
    }, environment: ${process.env.NODE_ENV.toUpperCase()}`,
  );

  if (process.env.NODE_ENV === 'production') {
    await metaBroadcastSynchronize();
  }
});
