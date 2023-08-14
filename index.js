const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3000;
require('dotenv').config();

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`${process.env.APP_NAME} running on ${process.env.BASE_URL}`);
});
