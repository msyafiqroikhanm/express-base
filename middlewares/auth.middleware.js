const passport = require('passport');
const rolesLib = require('../libraries/roles.lib');
const { ACM_Location } = require('../models');
const picTypeHelper = require('../helpers/pictype.helper');

class AuthMiddleware {
  static async authenticate(req, res, next, requiredFeatures) {
    try {
      passport.authenticate('jwt', { session: false }, (err, userData, info) => {
        // authenticate if user have login or not
        if (err) {
          return next(err);
        }
        if (!userData) {
          if (info.name === 'TokenExpiredError') {
            throw {
              code: 401,
              status: 'Unauthorized Request',
              message: 'Login expired, please try to re-login',
            };
          }
          if (info.name === 'JsonWebTokenError') {
            throw { code: 401, status: 'Unauthorized Request', message: 'Invalid token' };
          }
          throw {
            code: 401,
            status: 'Unauthorized Request',
            message: 'Please login to access this feature',
          };
        }
        req.user = userData;

        // check user access
        if (requiredFeatures) {
          const authorized = req.user.Role.USR_Features.some((feature) =>
            requiredFeatures.includes(feature.id),
          );

          if (!authorized) {
            throw {
              code: 401,
              status: 'Unauthorized Request',
              message: "You Don't Have Access To This Feature",
            };
          }
        }
        return next();
      })(req, res, next);
    } catch (error) {
      next(error);
    }
  }

  static async accomodation(req, res, next) {
    try {
      const limitation = { isAdmin: true, access: {} };
      if (req.user.Role.id !== rolesLib.superAdmin) {
        if (!req.user.PIC) {
          throw {
            code: 401,
            status: 'Unauthorized Request',
            message: 'Anda tidak memiliki akses ke layanan ini',
          };
        }

        const picTypes = await picTypeHelper().then((type) => [type.pic_location]);
        const picLocation = req.user.PIC.filter((pic) => pic.typeId === picTypes[0]);
        limitation.isAdmin = false;
        limitation.access.picId = picLocation[0].dataValues.id;

        const locationLimitation = await ACM_Location.findAll({
          where: { picId: limitation.access.picId },
          attributes: ['id', 'name'],
        });
        if (locationLimitation.length < 1) {
          limitation.access.location = locationLimitation;
        }
      }
      req.user.limitation = limitation;
      next();
    } catch (error) {
      next(error);
    }
  }

  static async xAppKey(req, res, next) {
    try {
      if (!req.headers) {
        throw {
          code: 401,
          status: 'Unauthorized Request',
          message: 'Anda tidak memiliki akses ke layanan ini',
        };
      }
      if (!req.headers['x-app-key']) {
        throw {
          code: 401,
          status: 'Unauthorized Request',
          message: 'Anda tidak memiliki akses ke layanan ini',
        };
      }
      if (req.headers['x-app-key'] !== 'PTJAKTOURJXBPTJAKTOURJXBPTJAKTOURJXB') {
        throw {
          code: 401,
          status: 'Unauthorized Request',
          message: 'Anda tidak memiliki akses ke layanan ini',
        };
      }
      next();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthMiddleware;
