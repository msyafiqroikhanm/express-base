const ResponseFormatter = require('../helpers/responseFormatter.helper');
const {
  selectAllFacilities,
  selectFacility,
  validateFacilityInputs,
  createFacility,
  updateFacility,
  deleteFacility,
} = require('../services/facility.service');

class FacilityController {
  static async getAll(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const data = await selectAllFacilities({});

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async getDetail(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const data = await selectFacility(req.params.id);
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

      const inputs = await validateFacilityInputs(req.body);
      if (!inputs.isValid && inputs.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', inputs.message);
      }
      const data = await createFacility(inputs.form);
      return ResponseFormatter.success201(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const data = await updateFacility(req.params.id, req.body);
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

      const data = await deleteFacility(req.params.id);
      if (!data.success) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = FacilityController;
