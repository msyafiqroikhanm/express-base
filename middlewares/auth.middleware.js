const passport = require('passport');

class AuthMiddleware {
  static async authenticate(req, res, next) {
    try {
      passport.authenticate('jwt', { session: false }, (err, userData, info) => {
        if (err) {
          return next(err);
        }
        if (!userData) {
          if (info.name === 'TokenExpiredError') {
            throw { code: 401, status: 'Unauthorized Request', message: 'Login expired, please try to re-login' };
          } if (info.name === 'JsonWebTokenError') {
            throw { code: 401, status: 'Unauthorized Request', message: 'Invalid token' };
          }
          throw { code: 401, status: 'Unauthorized Request', message: 'Please login to access this feature' };
        }
        req.user = userData;
        return next();
      })(req, res, next);
    } catch (error) {
      next(error);
    }
  }

  static async authorization(req, res, next, requiredFeature) {
    try {
      const authorized = req.user.Role.USR_Features
        .some((feature) => feature.id === requiredFeature);

      if (!authorized) {
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
