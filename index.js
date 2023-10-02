const http = require('http');
const app = require('./app');
const db = require('./models');
const { metaBroadcastSynchronize } = require('./config/cron');
const { initializeSocketIO } = require('./config/websocket');

const port = process.env.PORT || 3000;
require('dotenv').config();

const server = http.createServer(app);
const io = initializeSocketIO(server);
app.set('socketIo', io);
server.listen(port, async () => {
  await db.sequelize.authenticate();
  console.log(`${process.env.APP_NAME} running on ${process.env.BASE_URL}`);

  if (process.env.NODE_ENV === 'production') {
    await metaBroadcastSynchronize();
  }
});
