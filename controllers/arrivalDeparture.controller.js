const ResponseFormatter = require('../helpers/responseFormatter.helper');
const {
  selectAllArrivalDepartures, selectArrivalDeparture, validateArrivalDepartureInputs,
  createArrivalDeparture, updateArrivalDeparture, deleteArrivalDeparture,
} = require('../services/arrivalDeparture.service');

class ArrivalDeparture {
  static async getAll(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      // resrict data that is not an admin
      const where = {};
      if (!req.user.limitation.isAdmin) {
        where.contingentId = req.user.limitation.access.contingentId;
      }

      const data = await selectAllArrivalDepartures(where);

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
      if (!req.user.limitation.isAdmin) {
        where.contingentId = req.user.limitation.access.contingentId;
      }

      const data = await selectArrivalDeparture(req.params.id, where);
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
      const where = {};
      if (!req.user.limitation.isAdmin) {
        where.contingentId = req.user.limitation.access.contingentId;
      }

      const inputs = await validateArrivalDepartureInputs(req.body, where);
      if (!inputs.isValid && inputs.code === 400) {
        return ResponseFormatter.error400(res, 'Bad Request', inputs.message);
      }
      if (!inputs.isValid && inputs.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', inputs.message);
      }

      const data = await createArrivalDeparture(inputs.form);

      return ResponseFormatter.success201(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      // resrict data that is not an admin
      const where = {};
      if (!req.user.limitation.isAdmin) {
        where.contingentId = req.user.limitation.access.contingentId;
      }

      const inputs = await validateArrivalDepartureInputs(req.body, where);
      if (!inputs.isValid && inputs.code === 400) {
        return ResponseFormatter.error400(res, 'Bad Request', inputs.message);
      }
      if (!inputs.isValid && inputs.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', inputs.message);
      }

      const data = await updateArrivalDeparture(inputs.form, req.params.id);
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

      // resrict data that is not an admin
      const where = {};
      if (!req.user.limitation.isAdmin) {
        where.contingentId = req.user.limitation.access.contingentId;
      }

      const data = await deleteArrivalDeparture(req.params.id, where);
      if (!data.success && data.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ArrivalDeparture;
