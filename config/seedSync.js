/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable no-await-in-loop */
const fs = require('fs').promises; // Use promisified fs functions
const path = require('path');
const chalk = require('chalk');
const { Sequelize } = require('sequelize');
const { sequelize, SequelizeMeta_Seeder } = require('../models');
require('dotenv').config();

const seedersDirectory = path.join(__dirname, '../seeders');

async function runSeeding() {
  try {
    let isUptodate = true;
    const seederFiles = await fs.readdir(seedersDirectory);

    let nodeEnvStyle;
    if (process.env.NODE_ENV === 'local') {
      nodeEnvStyle = chalk.bgGreen(chalk.black(process.env.NODE_ENV));
    }
    if (process.env.NODE_ENV === 'development') {
      nodeEnvStyle = chalk.bgYellow(chalk.black(process.env.NODE_ENV));
    }
    if (process.env.NODE_ENV === 'production') {
      nodeEnvStyle = chalk.bgRedBright(chalk.black(process.env.NODE_ENV));
    }
    console.log(chalk.bold.underline('Seeders Automatic Synchronization'));
    console.log();
    console.log("Loaded configuration file 'config/seedSync.js'.");
    console.log(`Using Environment : ${nodeEnvStyle}`);

    for (let i = 0; i < seederFiles.length; i += 1) {
      const file = seederFiles[i];

      if (!['.gitkeep', 'data', 'index.js'].includes(file)) {
        // console.log(file);
        const seeder = await SequelizeMeta_Seeder.findOne({
          where: { name: file },
          logging: false,
        });
        if (!seeder) {
          isUptodate = false;
          const seederStartTime = new Date().getTime();
          console.log(`== ${file}: seeding =======`);
          const seederModule = require(path.join(seedersDirectory, file));
          await seederModule.up(sequelize.getQueryInterface(), Sequelize);
          await SequelizeMeta_Seeder.create({ name: file });
          const seederEndTime = new Date().getTime();
          const elapsed = (seederEndTime - seederStartTime) / 1000;

          console.log(`== ${file}: seeded (${elapsed.toFixed(3)}s)`);
          console.log();
        }
      }
    }
    if (isUptodate) {
      console.log('No seeders were executed, seeder data was already up to date.');
    }
  } catch (err) {
    console.error('Error during seeding:', err);
  }
}

runSeeding();
