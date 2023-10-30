const { Op } = require('sequelize');
const ResponseFormatter = require('../helpers/responseFormatter.helper');
const {
  validateFnBScheduleMenuInputs,
  createFnBScheduleMenu,
  selectAllFnBScheduleMenus,
  selectFnBScheduleMenu,
  updateFnBScheduleMenu,
  deleteFnbScheduleMenu,
} = require('../services/fnbScheduleMenu.service');

class FNBScheduleMenuController {
  static async getAll(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;
      res.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

      // resrict data that is not an admin
      const where = {};
      if (!req.user.limitation.isAdmin) {
        where.kitchenId = { [Op.or]: req.user.limitation.access.kitchen };
      }

      const query = {};
      if (req.query?.scheduleId) {
        query.scheduleId = req.query.scheduleId;
      }
      if (req.query?.kitchenTargetId) {
        query.kitchenTargetId = req.query.kitchenTargetId;
      }
      if (req.query?.isValid) {
        query.isValid = req.query.isValid;
      }

      const data = await selectAllFnBScheduleMenus(query, where);
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
      res.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

      // resrict data that is not an admin
      const where = {};
      if (!req.user.limitation.isAdmin) {
        where.kitchenId = { [Op.or]: req.user.limitation.access.kitchen };
      }

      const data = await selectFnBScheduleMenu(req.params.id, where);
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
      res.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

      // resrict data that is not an admin
      const limitation = {};
      if (!req.user.limitation.isAdmin) {
        limitation.kitchens = req.user.limitation.access.kitchen;
      }

      const inputs = await validateFnBScheduleMenuInputs(req.body, limitation);
      if (!inputs.isValid && inputs.code === 400) {
        return ResponseFormatter.error400(res, 'Bad Request', inputs.message);
      }
      if (!inputs.isValid && inputs.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', inputs.message);
      }

      const data = await createFnBScheduleMenu(inputs.form);
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
      res.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

      // resrict data that is not an admin
      const where = { id: req.params.id };
      if (!req.user.limitation.isAdmin) {
        where.kitchenId = { [Op.or]: req.user.limitation.access.kitchen };
      }

      const data = await updateFnBScheduleMenu(req.body, where);
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
      res.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

      // resrict data that is not an admin
      const where = { id: req.params.id };
      if (!req.user.limitation.isAdmin) {
        where.kitchenId = { [Op.or]: req.user.limitation.access.kitchen };
      }

      const data = await deleteFnbScheduleMenu(where);
      if (!data.success && data.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = FNBScheduleMenuController;
