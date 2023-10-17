const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const morgan = require('morgan');
const cors = require('cors');
const passport = require('passport');
const errorHandling = require('./helpers/errorHandling.helper');
const routes = require('./routes/index.routes');

// Authentication middleware with passportjs

require('./config/passport');

app.use(passport.initialize());

app.use(
  morgan('common', {
    stream: fs.createWriteStream('./access.log', { flags: 'a' }),
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan('dev'));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(routes);
app.use(errorHandling);

module.exports = app;
