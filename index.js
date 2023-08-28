const http = require('http');
const app = require('./app');
const db = require('./models');

const port = process.env.PORT || 3000;
require('dotenv').config();

const server = http.createServer(app);
server.listen(port, async () => {
  await db.sequelize.authenticate();
  console.log(`${process.env.APP_NAME} running on ${process.env.BASE_URL}`);
});
