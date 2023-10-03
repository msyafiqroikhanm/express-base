const ResponseFormatter = require('../helpers/responseFormatter.helper');
const {
  selectAllDrivers, selectDriver, updateDriver, deleteDriver, validateDriverInputs, createDriver,
} = require('../services/driver.service');

class DriverController {
  static async getAll(req, res, next) {
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
      where.isAvailable = req.query?.isAvailable;

      const data = await selectAllDrivers(where);

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

      const data = await selectDriver(req.params.id, where);
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

      const inputs = await validateDriverInputs(req.body, where);
      if (!inputs.isValid && inputs.code === 400) {
        return ResponseFormatter.error400(res, 'Bad Request', inputs.message);
      }
      if (!inputs.isValid && inputs.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', inputs.message);
      }

      const data = await createDriver(inputs.form);

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

      const inputs = await validateDriverInputs(req.body, where, null, req.params.id);
      if (!inputs.isValid && inputs.code === 400) {
        return ResponseFormatter.error400(res, 'Bad Request', inputs.message);
      }
      if (!inputs.isValid && inputs.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', inputs.message);
      }

      const data = await updateDriver(inputs.form, req.params.id, where);
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

      const data = await deleteDriver(req.params.id, where);
      if (!data.success && data.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = DriverController;
