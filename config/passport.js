require('dotenv').config();

const passport = require('passport');
const passportJWT = require('passport-jwt');
const {
  user, role, feature,
} = require('../models');

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_PRIVATE_KEY,
};

passport.use(new JWTStrategy(opts, async (jwtPayload, done) => {
  try {
    const userData = await user.findByPk(
      jwtPayload.id,
      {
        include: [
          {
            model: role,
            include: {
              model: feature,
              through: {
                attributes: [],
              },
            },
          },
        ],
      },
    );
    if (!userData) {
      return done(null, false, { message: 'User not found!' });
    }
    return done(null, userData);
  } catch (err) {
    return done(err, false);
  }
}));

module.exports = passport;
