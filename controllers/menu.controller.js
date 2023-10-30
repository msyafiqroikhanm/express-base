const ResponseFormatter = require('../helpers/responseFormatter.helper');
const {
  selectAllMenus,
  selectMenu,
  validateMenuInputs,
  createMenu,
  updateMenu,
  deleteMenu,
} = require('../services/menu.service');
const { createNotifications } = require('../services/notification.service');

class MenuController {
  static async getAll(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;
      res.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

      // console.log(JSON.stringify(req.user.limitation, null, 2));
      const where = {};
      if (req.query?.parentOnly === 'yes') {
        where.parentMenuId = null;
      }
      if (req.query?.date) {
        where.date = req.query.date;
      }
      if (req.query?.menuTypeId) {
        where.menuTypeId = req.query.menuTypeId;
      }
      if (req.query?.foodTypeId) {
        where.foodTypeId = req.query.foodTypeId;
      }
      const data = await selectAllMenus(where);

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async getDetail(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;
      res.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

      const where = { id: req.params.id };

      const data = await selectMenu(where);
      if (!data.success) {
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

      const inputs = await validateMenuInputs(req.body);
      if (!inputs.isValid && inputs.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', inputs.message);
      }

      const data = await createMenu(inputs.form);

      const io = req.app.get('socketIo');
      await createNotifications(io, 'Menu Created', data.content.id, [data.content.name]);

      return ResponseFormatter.success201(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;
      res.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

      const where = { id: req.params.id };

      const data = await updateMenu(where, req.body);
      if (!data.success) {
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
      res.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

      const where = { id: req.params.id };

      const data = await deleteMenu(where);
      if (!data.success) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MenuController;
