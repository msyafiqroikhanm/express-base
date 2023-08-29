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
                attributes: ['id', 'name'],
              },
            },
          },
        ],
      },
    );
    if (!userData) {
      return done(null, false, { message: 'User not found!' });
    }

    // get parsed feature and module in user
    const parsedFeatures = [];
    userData.Role.USR_Features.forEach((feature) => {
      parsedFeatures.push({
        id: feature.dataValues.id,
        name: feature.dataValues.name,
        moduleId: feature.USR_Module.dataValues.id,
        modulesName: feature.USR_Module.dataValues.name,
      });
    });

    // getting array that group by module
    const groupedArray = parsedFeatures.reduce((result, item) => {
      const existingModule = result.find((module) => module.id === item.moduleId);

      if (existingModule) {
        existingModule.features.push({
          id: item.id,
          name: item.name,
        });
      } else {
        result.push({
          id: item.moduleId,
          name: item.modulesName,
          features: [
            {
              id: item.id,
              name: item.name,
            },
          ],
        });
      }

      return result;
    }, []);

    // parsing userData
    userData.Role.dataValues.modules = groupedArray;
    userData.Role.modules = groupedArray;
    delete userData.Role.dataValues.USR_Features;

    console.log(JSON.stringify(userData, null, 2));
    return done(null, userData);
  } catch (err) {
    return done(err, false);
  }
}));

module.exports = passport;
