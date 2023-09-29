const ResponseFormatter = require('../helpers/responseFormatter.helper');
const {
  validateKitchenTargetInputs,
  createKitchenTarget,
  selectAllKitchenTargets,
  selectKitchenTarget,
  updateKitchenTarget,
  deleteKitchenTarget,
} = require('../services/kitchenTarget.service');

class KitchenTargetController {
  static async getAll(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      // console.log(JSON.stringify(req.user.limitation, null, 2));
      const where = {};
      if (!req.user.limitation.isAdmin) {
        where.picId = req.user.limitation.access.picId;
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
        where.picId = req.user.limitation.access.picId;
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

      const data = await createKitchenTarget(inputs.form);

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
        where.picId = req.user.limitation.access.picId;
      }

      const data = await updateKitchenTarget(where, req.body);
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

      const where = { id: req.params.id };
      if (!req.user.limitation.isAdmin) {
        where.picId = req.user.limitation.access.picId;
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
