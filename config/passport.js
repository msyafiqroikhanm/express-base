/* eslint-disable no-param-reassign */
require('dotenv').config();

const passport = require('passport');
const passportJWT = require('passport-jwt');
const {
  USR_User, USR_Role, USR_Feature, USR_Module, USR_PIC, REF_PICType, PAR_Participant,
} = require('../models');
const { parsingUserModules } = require('../helpers/parsing.helper');

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_PRIVATE_KEY,
};

passport.use(
  new JWTStrategy(opts, async (jwtPayload, done) => {
    try {
      const userData = await USR_User.findByPk(jwtPayload.userId, {
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
                attributes: ['id', 'name'],
                include: { model: USR_Module, as: 'parentModule', attributes: ['id', 'name'] },
              },
            },
          },
          {
            model: USR_PIC,
            as: 'PIC',
            attributes: ['id', 'userId', 'typeId'],
            include: { model: REF_PICType, attributes: { exclude: ['createdAt', 'updatedAt'] } },
          },
          {
            model: PAR_Participant,
            as: 'participant',
            attributes: ['contingentId', 'name', 'file'],
          },
        ],
      });
      if (!userData) {
        return done(null, false, { message: 'User not found!' });
      }

      const result = parsingUserModules(userData);
      // parsing userData
      userData.Role.dataValues.modules = result;
      userData.Role.modules = result;
      delete userData.Role.dataValues.USR_Features;

      return done(null, userData);
    } catch (err) {
      return done(err, false);
    }
  }),
);

module.exports = passport;
