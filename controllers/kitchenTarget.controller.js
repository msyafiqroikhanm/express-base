const { Op } = require('sequelize');
const ResponseFormatter = require('../helpers/responseFormatter.helper');
const {
  validateKitchenTargetInputs,
  createKitchenTarget,
  selectAllKitchenTargets,
  selectKitchenTarget,
  updateKitchenTarget,
  deleteKitchenTarget,
  progressActualKitchenTarget,
} = require('../services/kitchenTarget.service');
const { createNotifications } = require('../services/notification.service');

class KitchenTargetController {
  static async getAll(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      // console.log(JSON.stringify(req.user.limitation, null, 2));
      const where = {};
      if (!req.user.limitation.isAdmin) {
        where.kitchenId = { [Op.or]: req.user.limitation.access.kitchen };
      }

      if (req.query?.date) {
        where.date = req.query.date;
      }
      if (req.query?.menuId) {
        where.menuId = req.query.menuId;
      }
      if (req.query?.kitchenId) {
        where.kitchenId = req.query.kitchenId;
      }

      const data = await selectAllKitchenTargets(where);

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async getDetail(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const where = { id: req.params.id };
      if (!req.user.limitation.isAdmin) {
        where.kitchenId = { [Op.or]: req.user.limitation.access.kitchen };
      }

      const data = await selectKitchenTarget(where);
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

      if (!req.user.limitation.isAdmin) {
        req.body.picId = req.user.limitation.access.picId;
      }
      // console.log(JSON.stringify({ limitation: req.user.limitation, body: req.body }, null, 2));

      const inputs = await validateKitchenTargetInputs(req.body);
      if (!inputs.isValid && inputs.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', inputs.message);
      }

      if (!inputs.isValid && inputs.code === 400) {
        return ResponseFormatter.error400(res, 'Bad Request', inputs.message);
      }

      const data = await createKitchenTarget(inputs.form);

      const io = req.app.get('socketIo');
      await createNotifications(
        io,
        'Kitchen Target Created',
        data.content.id,
        [`menu ${data.content.menu} for ${data.content.quantityTarget} pax`, data.content.kitchen],
      );

      return ResponseFormatter.success201(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const where = { id: req.params.id };
      if (!req.user.limitation.isAdmin) {
        where.kitchenId = { [Op.or]: req.user.limitation.access.kitchen };
      }

      const data = await updateKitchenTarget(where, req.body);
      if (!data.success && data.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }
      if (!data.success && data.code === 400) {
        return ResponseFormatter.error400(res, 'Bad Request', data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async updateActualKitchenTarget(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const where = { id: req.params.id };
      if (!req.user.limitation.isAdmin) {
        where.kitchenId = { [Op.or]: req.user.limitation.access.kitchen };
      }

      // console.log(req.body);
      const data = await progressActualKitchenTarget(where, req.body);
      if (!data.success) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }

      const io = req.app.get('socketIo');
      await createNotifications(
        io,
        'Kitchen Target Updated',
        data.content.id,
        [data.content.kitchen, `${data.content.quantityActual} pax for menu ${data.content.menu}`],
      );

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const where = { id: req.params.id };
      if (!req.user.limitation.isAdmin) {
        where.kitchenId = { [Op.or]: req.user.limitation.access.kitchen };
      }

      const data = await deleteKitchenTarget(where);
      if (!data.success) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = KitchenTargetController;
