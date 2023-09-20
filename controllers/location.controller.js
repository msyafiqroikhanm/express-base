const ResponseFormatter = require('../helpers/responseFormatter.helper');
const {
  selectAllLocations,
  selectLocation,
  createLocation,
  validateLocationInputs,
  updateLocation,
  deleteLocation,
  findCoordinate,
} = require('../services/location.service');

class LocationController {
  static async getAll(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const where = {};
      if (!req.user.limitation.isAdmin) {
        where.picId = req.user.limitation.access.picId;
      }
      if (req.query) {
        if (req.query.typeId) {
          where.typeId = req.query.typeId;
        }
      }

      const data = await selectAllLocations(where);

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async getDetail(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      console.log(JSON.stringify({ limitation: req.user, body: req.body }, null, 2));
      const where = { id: req.params.id };
      if (!req.user.limitation.isAdmin) {
        req.body.picId = req.user.limitation.access.picId;
      }

      const data = await selectLocation(where);
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
      console.log(JSON.stringify({ limitation: req.user.limitation, body: req.body }, null, 2));

      const inputs = await validateLocationInputs(req.body);
      if (!inputs.isValid && inputs.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', inputs.message);
      }

      const data = await createLocation(inputs.form);

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

      const data = await updateLocation(where, req.body);
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

      const data = await deleteLocation(where);
      if (!data.success) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async coordinate(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const data = await findCoordinate(req.query);

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = LocationController;
