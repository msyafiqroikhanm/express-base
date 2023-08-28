/* eslint-disable no-param-reassign */
require('dotenv').config();

const passport = require('passport');
const passportJWT = require('passport-jwt');
const {
  USR_User, USR_Role, USR_Feature, USR_Module,
} = require('../models');

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_PRIVATE_KEY,
};

passport.use(new JWTStrategy(opts, async (jwtPayload, done) => {
  try {
    const userData = await USR_User.findByPk(
      jwtPayload.userId,
      {
        attributes: { exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'] },
        include: [
          {
            model: USR_Role,
            as: 'Role',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            include: {
              model: USR_Feature,
              attributes: { exclude: ['createdAt', 'updatedAt'] },
              through: {
                attributes: [],
              },
              include: {
                model: USR_Module,
                attributes: ['name'],
              },
            },
          },
        ],
      },
    );
    if (!userData) {
      return done(null, false, { message: 'User not found!' });
    }

    // parsing userData
    userData.Role.USR_Features.forEach((feature) => {
      feature.dataValues.module = feature.USR_Module.name;
      feature.module = feature.USR_Module.name;

      delete feature.USR_Module;
      delete feature.dataValues.USR_Module;
    });
    return done(null, userData);
  } catch (err) {
    return done(err, false);
  }
}));

module.exports = passport;
