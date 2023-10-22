const ResponseFormatter = require('../helpers/responseFormatter.helper');
const { createNotifications } = require('../services/notification.service');
const {
  selectAllVehicleSchedule, selectVehicleSchedule, validateVehicleScheduleInputs,
  createVehicleSchedule,
  updateVehicleSchedule,
  deleteVehicleSchedule,
  progressVehicleSchedule,
  validateProvideScheduleInputs,
  vendorProvideTransportationSchedule,
  validatePassengerAbsent,
  udpatePassengerAbsent,
  selectAllPassengersVehicleSchedule,
  validateProgressVehicleScheduleInputs,
} = require('../services/vehicleSchedule.service');

class VehicleScheduleController {
  static async getAll(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      // resrict data that is not an admin
      const where = {};

      if (!req.user.limitation.isAdmin && req.user.limitation?.access?.picId) {
        where.picId = req.user.limitation.access.picId;
        where.vendors = req.user.limitation.access.vendors;
      } else if (!req.user.limitation.isAdmin && req.user.limitation?.access?.driverId) {
        where.driverId = req.user.limitation.access.driverId;
      }
      where.query = req.query?.type || null;

      const data = await selectAllVehicleSchedule(where);

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

      const data = await selectVehicleSchedule(req.params.id, where);
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

      const inputs = await validateVehicleScheduleInputs(req.body, true);
      if (!inputs.isValid && inputs.code === 400) {
        return ResponseFormatter.error400(res, 'Bad Request', inputs.message);
      }
      if (!inputs.isValid && inputs.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', inputs.message);
      }

      const data = await createVehicleSchedule(inputs.form);

      const io = req.app.get('socketIo');
      await createNotifications(
        io,
        'Transportation Schedule Created',
        data.content.id,
        [data.content.name, data.content.pickUpTime],
      );

      return ResponseFormatter.success201(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const inputs = await validateVehicleScheduleInputs(req.body, true);
      if (!inputs.isValid && inputs.code === 400) {
        return ResponseFormatter.error400(res, 'Bad Request', inputs.message);
      }
      if (!inputs.isValid && inputs.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', inputs.message);
      }

      const data = await updateVehicleSchedule(inputs.form, req.params.id);
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

      const data = await deleteVehicleSchedule(req.params.id);
      if (!data.success && data.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async provideTransportation(req, res, next) {
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

      const inputs = await validateProvideScheduleInputs(req.body, req.params.id, where);
      if (!inputs.isValid && inputs.code === 400) {
        return ResponseFormatter.error400(res, 'Bad Request', inputs.message);
      }
      if (!inputs.isValid && inputs.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', inputs.message);
      }

      const data = await vendorProvideTransportationSchedule(inputs.form, req.params.id);

      const io = req.app.get('socketIo');
      await createNotifications(
        io,
        'Transportation Schedule Assigned',
        data.content.id,
        [data.content.name, data.content.pickUpTime],
      );

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async absent(req, res, next) {
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

      const inputs = await validatePassengerAbsent(req.body, req.params.id, where);
      if (!inputs.isValid && inputs.code === 400) {
        return ResponseFormatter.error400(res, 'Bad Request', inputs.message);
      }
      if (!inputs.isValid && inputs.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', inputs.message);
      }

      const data = await udpatePassengerAbsent(inputs.form);
      if (!data.success && data.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async progressStatus(req, res, next) {
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

      const inputs = await validateProgressVehicleScheduleInputs(
        req.body,
        req.params.id,
        where,
        req.user.limitation.isAdmin,
      );
      if (!inputs.isValid && inputs.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', inputs.message);
      }
      if (!inputs.isValid && inputs.code === 400) {
        return ResponseFormatter.error400(res, 'Bad Request', inputs.message);
      }

      const data = await progressVehicleSchedule(
        inputs.form,
        req.params.id,
        where,
        req.user.limitation.isAdmin,
      );
      if (!data.success && data.code === 400) {
        return ResponseFormatter.error400(res, 'Bad Request', data.message);
      }
      if (!data.success && data.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }

      const io = req.app.get('socketIo');
      await createNotifications(
        io,
        'Transportation Schedule Progress',
        data.content.id,
        [data.content.name, data.content.status, data.content.updatedAt],
      );

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async getPassengers(req, res, next) {
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

      const data = await selectAllPassengersVehicleSchedule(req.params.id, where);
      if (!data.success && data.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = VehicleScheduleController;
