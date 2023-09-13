const ResponseFormatter = require('../helpers/responseFormatter.helper');
const {
  selectAllCouriers,
  selectCourier,
  validateCourierInputs,
  createCourier,
  updateCourier,
  deleteCourier,
} = require('../services/courier.service');

class CourierController {
  static async getAll(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      // console.log(JSON.stringify(req.user.limitation, null, 2));
      const where = {};
      const data = await selectAllCouriers(where);

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async getDetail(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const where = { id: req.params.id };
      const data = await selectCourier(where);
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

      const inputs = await validateCourierInputs(req.body);
      if (!inputs.isValid && inputs.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', inputs.message);
      }

      const data = await createCourier(inputs.form);
      return ResponseFormatter.success201(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const where = { id: req.params.id };

      const data = await updateCourier(where, req.body);
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

      const data = await deleteCourier(where);
      if (!data.success) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CourierController;
