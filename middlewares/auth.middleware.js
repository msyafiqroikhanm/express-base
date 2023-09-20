const passport = require('passport');
const rolesLib = require('../libraries/roles.lib');
const { ACM_Location, FNB_Kitchen, PAR_Participant, TPT_Driver, TPT_Vendor } = require('../models');
const picTypeHelper = require('../helpers/pictype.helper');
const ResponseFormatter = require('../helpers/responseFormatter.helper');

class AuthMiddleware {
  static async authenticate(req, res, next, requiredFeatures) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      passport.authenticate('jwt', { session: false }, (err, userData, info) => {
        // authenticate if user have login or not
        if (err) {
          return next(err);
        }
        if (!userData) {
          if (info.name === 'TokenExpiredError') {
            return ResponseFormatter.error401(res, 'Login expired, please try to re-login');
          }
          if (info.name === 'JsonWebTokenError') {
            return ResponseFormatter.error401(res, 'Invalid token');
          }
          return ResponseFormatter.error401(res, 'Please login to access this feature');
        }
        req.user = userData;

        // check user access
        if (requiredFeatures) {
          const authorized = req.user.Role.USR_Features.some((feature) =>
            requiredFeatures.includes(feature.id),
          );

          if (!authorized) {
            return ResponseFormatter.error401(res, "You Don't Have Access To This Feature");
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
      res.url = `${req.method} ${req.originalUrl}`;

      const limitation = { isAdmin: true, access: {} };

      if (req.user.Role.id !== rolesLib.superAdmin) {
        if (req.user.PIC) {
          const picTypes = await picTypeHelper().then((type) => [type.pic_location]);
          const picLocation = req.user.PIC.filter((pic) => pic.typeId === picTypes[0]);
          console.log(JSON.stringify(req.user.PIC, null, 2));
          limitation.isAdmin = false;
          limitation.access.picId = picLocation[0].dataValues.id;

          const locationLimitation = await ACM_Location.findAll({
            where: { picId: limitation.access.picId },
            attributes: ['id'],
            raw: true,
          });

          const locations = locationLimitation.map((element) => element.id);

          if (locationLimitation.length > 0) {
            limitation.access.location = locations;
          }
        } else {
          return ResponseFormatter.error401(res, "You Don't Have Access To This Service");
        }
      }
      req.user.limitation = limitation;
      next();
    } catch (error) {
      next(error);
    }
  }

  static async fnb(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const limitation = { isAdmin: true, access: {} };
      if (req.user.Role.id !== rolesLib.superAdmin) {
        if (!req.user.PIC) {
          return ResponseFormatter.error401(res, "You Don't Have Access To This Service");
        }

        const picTypes = await picTypeHelper().then((type) => [type.pic_kitchen]);
        const picKitchen = req.user.PIC.filter((pic) => pic.typeId === picTypes[0]);
        limitation.isAdmin = false;
        limitation.access.picId = picKitchen[0].dataValues.id;

        const kitchenLimitation = await FNB_Kitchen.findAll({
          where: { picId: limitation.access.picId },
          attributes: ['id'],
          raw: true,
        });

        const kitchens = kitchenLimitation.map((element) => element.id);

        if (kitchenLimitation.length > 0) {
          limitation.access.kitchen = kitchens;
        }
      }
      req.user.limitation = limitation;
      next();
    } catch (error) {
      next(error);
    }
  }

  static async participant(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const limitation = { isAdmin: true, access: {} };
      if (req.user.participant.contingentId && req.user.Role.id !== rolesLib.superAdmin) {
        limitation.isAdmin = false;
        limitation.access.contingentId = req.user.participant.contingentId;
        limitation.access.contingent = { id: req.user.participant.contingentId };
      }
      req.user.limitation = limitation;
      next();
    } catch (error) {
      next(error);
    }
  }

  static async dashboard(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const limitation = { isAdmin: true, access: {} };
      // * participant
      if (req.user.participant.contingentId && req.user.Role.id !== rolesLib.superAdmin) {
        limitation.isAdmin = false;
        limitation.access.contingent = {
          contingentId: req.user.participant.contingentId,
          id: req.user.participant.contingentId,
        };
      }

      // * accomodation

      // * transportation

      // * fnb

      // * event

      // * customer service

      req.user.limitation = limitation;
      next();
    } catch (error) {
      next(error);
    }
  }

  static async transportation(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const participantInstance = await PAR_Participant.findByPk(req.user?.participantId, {
        attributes: ['phoneNbr'],
      });

      const driverInstance = await TPT_Driver.findOne({
        where: { phoneNbr: participantInstance?.phoneNbr },
      });

      const limitation = { isAdmin: true, access: {} };
      if (req.user.Role.id !== rolesLib.superAdmin) {
        if (req.user.PIC) {
          const picTypes = await picTypeHelper().then((type) => [type.pic_transportation]);
          const picTransportation = req.user.PIC.filter((pic) => pic.typeId === picTypes[0]);
          limitation.isAdmin = false;
          limitation.access.picId = picTransportation[0].dataValues.id;

          const vendors = await TPT_Vendor.findAll({
            where: { picId: limitation.access.picId },
            attributes: ['id'],
          });

          const parsedVendors = vendors.map((vendor) => vendor.id);

          limitation.access.vendors = parsedVendors.length > 0 ? parsedVendors : null;
        } else if (driverInstance) {
          limitation.access.driverId = driverInstance.id;
        } else {
          return ResponseFormatter.error401(res, "You Don't Have Access To This Service");
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
