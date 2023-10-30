const ResponseFormatter = require('../helpers/responseFormatter.helper');
const {
  selectAllKitchens,
  selectKitchen,
  validateKitchenInputs,
  createKitchen,
  updateKitchen,
  deleteKitchen,
} = require('../services/kitchen.service');
const { createNotifications } = require('../services/notification.service');

class KitchenController {
  static async getAll(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;
      res.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

      // console.log(JSON.stringify(req.user.limitation, null, 2));
      const where = {};
      if (!req.user.limitation.isAdmin) {
        where.picId = req.user.limitation.access.picId;
      }

      const data = await selectAllKitchens(where);

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
      if (!req.user.limitation.isAdmin) {
        where.picId = req.user.limitation.access.picId;
      }

      const data = await selectKitchen(where);
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

      if (!req.user.limitation.isAdmin) {
        req.body.picId = req.user.limitation.access.picId;
      }
      // console.log(JSON.stringify({ limitation: req.user.limitation, body: req.body }, null, 2));

      const inputs = await validateKitchenInputs(req.body);
      if (!inputs.isValid && inputs.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', inputs.message);
      }

      const data = await createKitchen(inputs.form);
      const io = req.app.get('socketIo');
      await createNotifications(io, 'Kitchen Created', data.content.id, [data.content.name]);

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
      if (!req.user.limitation.isAdmin) {
        where.picId = req.user.limitation.access.picId;
      }

      const data = await updateKitchen(where, req.body);
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
      if (!req.user.limitation.isAdmin) {
        where.picId = req.user.limitation.access.picId;
      }

      const data = await deleteKitchen(where);
      if (!data.success) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = KitchenController;
