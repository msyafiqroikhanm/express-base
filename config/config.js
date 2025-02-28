require('dotenv').config();

module.exports = {
  local: {
    username: process.env.LOCAL_DB_USERNAME,
    password: process.env.LOCAL_DB_PASSWORD,
    database: process.env.LOCAL_DB_NAME,
    host: process.env.LOCAL_DB_HOST,
    dialect: process.env.LOCAL_DB_DIALECT,
    timezone: '+07:00', // for writing to database
  },
  test: {
    username: process.env.TEST_DB_USERNAME || 'root',
    password: process.env.TEST_DB_PASSWORD || 'sipalingroot',
    database: process.env.TEST_DB_NAME || 'test_database',
    dialect: process.env.TEST_DB_DIALECT || 'mysql',
    timezone: '+07:00', // for writing to database
  },
  development: {
    username: process.env.DEV_DB_USERNAME,
    password: process.env.DEV_DB_PASSWORD,
    database: process.env.DEV_DB_NAME,
    host: process.env.DEV_DB_HOST,
    dialect: process.env.DEV_DB_DIALECT,
    timezone: '+07:00', // for writing to database
  },
  production: {
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOST,
    dialect: process.env.PROD_DB_DIALECT,
    timezone: '+07:00', //
  },
};
