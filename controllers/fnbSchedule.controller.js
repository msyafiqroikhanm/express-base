const { Op } = require('sequelize');
const ResponseFormatter = require('../helpers/responseFormatter.helper');
const {
  validateFnBScheduleInputs,
  createFnBSchedule,
  selectAllFnBSchedules,
  selectFnBSchedule,
  updateFnBSchedule,
  deleteFnbSchedule,
} = require('../services/fnbSchedule.service');

class FNBScheduleController {
  static async getAll(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      // resrict data that is not an admin
      // console.log(JSON.stringify(req.user.limitation));

      const where = {};
      if (req.query?.statusId) {
        where.statusId = req.query.statusId;
      }
      if (req.query?.courierId) {
        where.courierId = req.query.courierId;
      }
      if (req.query?.locationId) {
        where.locationId = req.query.locationId;
      }
      if (req.query?.kitchenId) {
        where.kitchenId = req.query.kitchenId;
      }

      if (!req.user.limitation.isAdmin) {
        // console.log(Boolean(req.user.limitation.access.location));
        if (req.user.limitation.access.kitchen) {
          where.kitchenId = { [Op.or]: req.user.limitation.access.kitchen };
        }
        if (req.user.limitation.access.location) {
          where.locationId = { [Op.or]: req.user.limitation.access.location };
        }
        if (req.user.limitation.access.courierId) {
          where.courierId = req.user.limitation.access.courierId;
        }
      }

      const data = await selectAllFnBSchedules(where);
      if (!data.success) {
        return ResponseFormatter.error400(res, 'Bad Request', data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async getDetail(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      // resrict data that is not an admin
      const where = { id: req.params.id };
      if (!req.user.limitation.isAdmin) {
        // console.log(Boolean(req.user.limitation.access.location));
        if (req.user.limitation.access.kitchen) {
          where.kitchenId = { [Op.or]: req.user.limitation.access.kitchen };
        }
        if (req.user.limitation.access.location) {
          where.locationId = { [Op.or]: req.user.limitation.access.location };
        }
        if (req.user.limitation.access.courierId) {
          where.courierId = req.user.limitation.access.courierId;
        }
      }

      const data = await selectFnBSchedule(req.params.id, where);
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
      const limitation = {};
      if (!req.user.limitation.isAdmin) {
        limitation.kitchens = req.user.limitation.access.kitchen;
      }

      const inputs = await validateFnBScheduleInputs(req.body, limitation);
      if (!inputs.isValid && inputs.code === 400) {
        return ResponseFormatter.error400(res, 'Bad Request', inputs.message);
      }
      if (!inputs.isValid && inputs.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', inputs.message);
      }

      const data = await createFnBSchedule(inputs.form);
      if (!data.success) {
        return ResponseFormatter.error400(res, 'Bad Request', data.message);
      }

      return ResponseFormatter.success201(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      // resrict data that is not an admin
      const where = { id: req.params.id };
      if (!req.user.limitation.isAdmin) {
        // console.log(Boolean(req.user.limitation.access.location));
        if (req.user.limitation.access.kitchen) {
          where.kitchenId = { [Op.or]: req.user.limitation.access.kitchen };
        }
        if (req.user.limitation.access.location) {
          where.locationId = { [Op.or]: req.user.limitation.access.location };
        }
        if (req.user.limitation.access.courierId) {
          where.courierId = req.user.limitation.access.courierId;
        }
      }
      const data = await updateFnBSchedule(req.body, where);
      if (!data.success && data.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }
      if (!data.isValid && data.code === 400) {
        return ResponseFormatter.error400(res, 'Bad Request', data.message);
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
      const where = { id: req.params.id };
      if (!req.user.limitation.isAdmin) {
        // console.log(Boolean(req.user.limitation.access.location));
        if (req.user.limitation.access.kitchen) {
          where.kitchenId = { [Op.or]: req.user.limitation.access.kitchen };
        }
      }

      const data = await deleteFnbSchedule(where);
      if (!data.success && data.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = FNBScheduleController;
