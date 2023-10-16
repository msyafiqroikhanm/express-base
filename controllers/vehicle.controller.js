const ResponseFormatter = require('../helpers/responseFormatter.helper');
const { createNotifications } = require('../services/notification.service');
const {
  selectAllVehicles, validateVehicleQuery, selectVehicle, validateVehicleInputs,
  createVehicle, updateVehicle, deleteVehicle, selectVehicleSchedules,
  selectVehicleTracks, createTrackingVehicle,
} = require('../services/vehicle.service');

class VehicleController {
  static async getAll(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const query = await validateVehicleQuery(req.query);

      // resrict data that is not an admin
      const where = {};
      if (!req.user.limitation.isAdmin && req.user.limitation?.access?.picId) {
        where.picId = req.user.limitation.access.picId;
        where.vendors = req.user.limitation.access.vendors;
      } else if (!req.user.limitation.isAdmin && req.user.limitation?.access?.driver) {
        where.driverId = req.user.limitation.access.driverId;
      }

      const data = await selectAllVehicles(query, where);

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async getDetail(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      // resrict data that is not an admin
      const where = {};
      if (!req.user.limitation.isAdmin && req.user.limitation?.access?.picId) {
        where.picId = req.user.limitation.access.picId;
        where.vendors = req.user.limitation.access.vendors;
      } else if (!req.user.limitation.isAdmin && req.user.limitation?.access?.driver) {
        where.driverId = req.user.limitation.access.driverId;
      }

      const data = await selectVehicle(req.params.id, where);
      if (!data.success && data.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      // resrict data that is not an admin
      const where = {};
      if (!req.user.limitation.isAdmin && req.user.limitation?.access?.picId) {
        where.picId = req.user.limitation.access.picId;
        where.vendors = req.user.limitation.access.vendors;
      } else if (!req.user.limitation.isAdmin && req.user.limitation?.access?.driver) {
        where.driverId = req.user.limitation.access.driverId;
      }

      const inputs = await validateVehicleInputs(req.body, where);
      if (!inputs.isValid && inputs.code === 400) {
        return ResponseFormatter.error400(res, 'Bad Request', inputs.message);
      }
      if (!inputs.isValid && inputs.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', inputs.message);
      }

      const data = await createVehicle(inputs.form);

      const io = req.app.get('socketIo');
      await createNotifications(
        io,
        'Vehicle Created',
        data.content.id,
        [data.content.name, data.content.vendor],
      );

      return ResponseFormatter.success201(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      // resrict data that is not an admin
      const where = {};
      if (!req.user.limitation.isAdmin && req.user.limitation?.access?.picId) {
        where.picId = req.user.limitation.access.picId;
        where.vendors = req.user.limitation.access.vendors;
      } else if (!req.user.limitation.isAdmin && req.user.limitation?.access?.driver) {
        where.driverId = req.user.limitation.access.driverId;
      }

      const inputs = await validateVehicleInputs(req.body, where, req.params.id);
      if (!inputs.isValid && inputs.code === 400) {
        return ResponseFormatter.error400(res, 'Bad Request', inputs.message);
      }
      if (!inputs.isValid && inputs.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', inputs.message);
      }

      const data = await updateVehicle(inputs.form, req.params.id, where);
      if (!data.success && data.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      // resrict data that is not an admin
      const where = {};
      if (!req.user.limitation.isAdmin && req.user.limitation?.access?.picId) {
        where.picId = req.user.limitation.access.picId;
        where.vendors = req.user.limitation.access.vendors;
      } else if (!req.user.limitation.isAdmin && req.user.limitation?.access?.driver) {
        where.driverId = req.user.limitation.access.driverId;
      }

      const data = await deleteVehicle(req.params.id, where);
      if (!data.success && data.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async getSchedule(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      // resrict data that is not an admin
      const where = {};
      if (!req.user.limitation.isAdmin && req.user.limitation?.access?.picId) {
        where.picId = req.user.limitation.access.picId;
        where.vendors = req.user.limitation.access.vendors;
      } else if (!req.user.limitation.isAdmin && req.user.limitation?.access?.driver) {
        where.driverId = req.user.limitation.access.driverId;
      }

      const data = await selectVehicleSchedules(req.params.id, where);
      if (!data.success && data.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async getTrack(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      // resrict data that is not an admin
      const where = {};
      if (!req.user.limitation.isAdmin && req.user.limitation?.access?.picId) {
        where.picId = req.user.limitation.access.picId;
        where.vendors = req.user.limitation.access.vendors;
      } else if (!req.user.limitation.isAdmin && req.user.limitation?.access?.driver) {
        where.driverId = req.user.limitation.access.driverId;
      }

      const data = await selectVehicleTracks(req.params.id, where);
      if (!data.success && data.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async track(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      // resrict data that is not an admin
      const where = {};
      if (!req.user.limitation.isAdmin && req.user.limitation?.access?.picId) {
        where.picId = req.user.limitation.access.picId;
        where.vendors = req.user.limitation.access.vendors;
      } else if (!req.user.limitation.isAdmin && req.user.limitation?.access?.driver) {
        where.driverId = req.user.limitation.access.driverId;
      }

      const data = await createTrackingVehicle(req.body, req.params.id, where);
      if (!data.isValid && data.code === 400) {
        return ResponseFormatter.error400(res, 'Bad Request', data.message);
      }
      if (!data.isValid && data.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }

      return ResponseFormatter.success201(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = VehicleController;
