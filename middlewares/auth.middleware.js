const passport = require('passport');
const rolesLib = require('../libraries/roles.lib');
const {
  ACM_Location,
  FNB_Kitchen,
  TPT_Driver,
  TPT_Vendor,
  ENV_Event,
  FNB_Courier,
} = require('../models');
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
          const authorized = req.user.Role.USR_Features.some(
            (feature) => requiredFeatures.includes(feature.id),
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
        if (req.user.PIC.length) {
          const picTypes = await picTypeHelper().then((type) => [type.pic_location]);
          const picLocation = req.user.PIC.filter((pic) => pic.typeId === picTypes[0]);

          // * Need More Investigation for user is PIC for not this module

          // limitation.isAdmin = false;
          limitation.access.picId = picLocation[0].dataValues.id;

          const locationLimitation = await ACM_Location.findAll({
            where: { picId: limitation.access.picId },
            attributes: ['id'],
            raw: true,
          });

          const locations = locationLimitation.map((element) => element.id);

          if (locationLimitation.length > 0) {
            limitation.isAdmin = false;
            limitation.access.location = locations;
          }
        }
      }
      if (req.user.Role.name === 'Participant Coordinator') {
        limitation.isAdmin = false;
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
        if (req.user.PIC.length) {
          const picTypes = await picTypeHelper().then((type) => [type.pic_kitchen]);
          const picKitchen = req.user.PIC.filter((pic) => pic.typeId === picTypes[0]);

          // * Need More Investigation for user is PIC for not this module

          if (picKitchen.length) {
            // limitation.isAdmin = false;
            limitation.access.picId = picKitchen[0].dataValues.id;

            const kitchenLimitation = await FNB_Kitchen.findAll({
              where: { picId: limitation.access.picId },
              attributes: ['id'],
              raw: true,
            });

            const kitchens = kitchenLimitation.map((element) => element.id);

            if (kitchenLimitation.length > 0) {
              limitation.isAdmin = false;
              limitation.access.kitchen = kitchens;
            }
          }

          //* FOR PIC LOCATION
          const picLocTypes = await picTypeHelper().then((type) => [type.pic_location]);
          const picLocation = req.user.PIC.filter((pic) => pic.typeId === picLocTypes[0]);

          // * Need More Investigation for user is PIC for not this module

          if (picLocation.length) {
            // limitation.isAdmin = false;
            limitation.access.picId = picLocation[0].dataValues.id;

            const locationLimitation = await ACM_Location.findAll({
              where: { picId: limitation.access.picId },
              attributes: ['id'],
              raw: true,
            });

            const locations = locationLimitation.map((element) => element.id);

            if (locationLimitation.length > 0) {
              limitation.isAdmin = false;
              limitation.access.location = locations;
            }
          }
        }
        if (req.user.Role.name === 'Courier') {
          const courierInstance = await FNB_Courier.findOne({ where: { userId: req.user.id } });
          limitation.isAdmin = false;
          limitation.access.courierId = courierInstance.id;
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

      if (!req.user.Role.isAdministrative) {
        return ResponseFormatter.error401(res, "You Don't Have Access To This Service");
      }

      const roles = new Set();
      req.user.Role?.modules.forEach((module) => {
        if (module.features) {
          module.features.forEach((feature) => {
            roles.add(feature.featurename);
          });
        }
        if (module.submodules) {
          module.submodules.forEach((submodules) => {
            submodules.features.forEach((feature) => {
              roles.add(feature.featurename);
            });
          });
        }
      });

      const limitation = { isAdmin: true, access: {} };
      if (req.user.Role.id !== rolesLib.superAdmin) {
        limitation.isAdmin = false;
        limitation.allowedDashboard = [];
        // * participant
        if (roles.has('Create Participant') && roles.has('Update Participant')) {
          limitation.allowedDashboard.push('Participant Management');
          if (req.user.participant.contingentId && req.user.Role.id !== rolesLib.superAdmin) {
            limitation.access.contingent = {
              contingentId: req.user.participant.contingentId,
              id: req.user.participant.contingentId,
            };
          }
        }

        // * accomodation

        // * transportation
        if (roles.has('View Vehicle Schedule') && (roles.has('Provide Vehicle Schedule') || roles.has('Absent Vehicle Schedule') || roles.has('Create Vehicle Schedule'))) {
          limitation.allowedDashboard.push('Transportation Management');
          limitation.access.transportation = {};

          if (req.user?.Role?.name === 'Admin Transportation') {
            // case user is admin transportation
            const vendors = await TPT_Vendor.findAll({ attributes: ['id'] });
            const parsedVendors = vendors.map((vendor) => vendor.id);
            limitation.access.transportation.vendors = parsedVendors.length > 0
              ? parsedVendors : [];
          } else if (req.user.PIC?.length > 0) {
            // case user is pic transportation for a vendor
            const picTypes = await picTypeHelper().then((type) => [type.pic_transportation]);
            const picTransportation = req.user.PIC.filter((pic) => pic.typeId === picTypes[0]);

            if (picTransportation.length > 0) {
              const vendors = await TPT_Vendor.findAll({
                where: { picId: picTransportation[0].dataValues.id },
                attributes: ['id'],
              });

              const parsedVendors = vendors.map((vendor) => vendor.id);

              limitation.access.transportation.vendors = parsedVendors.length > 0
                ? parsedVendors : [null];
            }
          }
        }

        // * fnb

        // * event
        if (roles.has('View Event') && (roles.has('Create Event') || roles.has('Update Event') || roles.has('Delete Event'))) {
          limitation.allowedDashboard.push('Event Management');
          limitation.access.event = {};

          if (req.user?.Role?.name === 'Admin Event') {
            // case user is admin event
            const events = await ENV_Event.findAll({ attributes: ['id'] });
            const parsedEvent = events.map((event) => event.id);
            limitation.access.event.events = parsedEvent.length > 0
              ? parsedEvent : [];
          } else if (req.user.PIC?.length > 0) {
            // case user is pic event
            const picTypes = await picTypeHelper().then((type) => [type.pic_event]);
            const picEvent = req.user.PIC.filter((pic) => pic.typeId === picTypes[0]);

            if (picEvent.length) {
              const eventLimitation = await ENV_Event.findAll({
                where: { picId: picEvent[0].dataValues.id },
                attributes: ['id'],
                raw: true,
              });

              const events = eventLimitation.map((event) => event.id);

              limitation.access.event.events = events.length > 0
                ? events : [null];
            }
          }
        }

        // * customer service
      } else {
        limitation.allowedDashboard = [
          'Participant Management', 'Accomodation Management', 'Event Management', 'Transportation Management',
          'FnB Management', 'Customer Service Management',
        ];
      }

      req.user.limitation = limitation;
      next();
    } catch (error) {
      next(error);
    }
  }

  static async transportation(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const driverInstance = await TPT_Driver.findOne({
        where: { userId: req.user.id },
      });

      const limitation = { isAdmin: true, access: {} };
      if (req.user.Role.id !== rolesLib.superAdmin) {
        if (req.user.PIC?.length > 0) {
          const picTypes = await picTypeHelper().then((type) => [type.pic_transportation]);
          const picTransportation = req.user.PIC.filter((pic) => pic.typeId === picTypes[0]);

          // * Need More Investigation for user is PIC for not this module
          // if (!picTransportation.length) {
          //   req.user.limitation = limitation;
          //   next();
          // }

          limitation.isAdmin = false;
          limitation.access.picId = picTransportation[0].dataValues.id;

          const vendors = await TPT_Vendor.findAll({
            where: { picId: limitation.access.picId },
            attributes: ['id'],
          });

          const parsedVendors = vendors.map((vendor) => vendor.id);

          limitation.access.vendors = parsedVendors.length > 0 ? parsedVendors : [];
        } else if (driverInstance) {
          limitation.isAdmin = false;
          limitation.access.driverId = driverInstance.id;
        } else if (req.user?.Role?.name !== 'Admin Transportation') {
          return ResponseFormatter.error401(res, "You Don't Have Access To This Service");
        }
      }

      req.user.limitation = limitation;
      next();
    } catch (error) {
      next(error);
    }
  }

  static async event(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const limitation = { isAdmin: true, access: {} };

      if (req.user.Role.id !== rolesLib.superAdmin) {
        if (!req.user.PIC) {
          return ResponseFormatter.error401(res, "You Don't Have Access To This Service");
        }

        const picTypes = await picTypeHelper().then((type) => [type.pic_event]);
        const picEvent = req.user.PIC.filter((pic) => pic.typeId === picTypes[0]);
        if (picEvent.length) {
          limitation.isAdmin = false;
          limitation.access.picId = picEvent[0].dataValues.id;

          const eventLimitation = await ENV_Event.findAll({
            where: { picId: limitation.access.picId },
            attributes: ['id'],
            raw: true,
          });

          const events = eventLimitation.map((event) => event.id);

          limitation.access.events = events?.length > 0 ? events : [];
        }
      }

      req.user.limitation = limitation;
      req.user.dataValues.limitation = limitation;
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
