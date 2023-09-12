const { Op } = require('sequelize');
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

      // console.log(JSON.stringify(req.user.limitation, null, 2));
      const where = {};
      if (!req.user.limitation.isAdmin) {
        where.locationId = {
          [Op.or]: req.user.limitation.access.location,
        };
      }
      if (req.query) {
        if (req.query.locationId) {
          where.locationId = req.query.locationId;
        }
      }
      const data = await selectAllFacilities(where);

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
        where.locationId = {
          [Op.or]: req.user.limitation.access.location,
        };
      }
      const data = await selectFacility(where);
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

      const where = { id: req.body.locationId };
      if (!req.user.limitation.isAdmin) {
        where.picId = req.user.limitation.access.picId;
      }

      console.log(JSON.stringify(req.user.limitation, null, 2));
      const inputs = await validateFacilityInputs(req.body, where);
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

      const where = { id: req.params.id };
      if (!req.user.limitation.isAdmin) {
        where.locationId = {
          [Op.or]: req.user.limitation.access.location,
        };
      }

      const data = await updateFacility(where, req.body);
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
        where.locationId = {
          [Op.or]: req.user.limitation.access.location,
        };
      }

      const data = await deleteFacility(where);
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
