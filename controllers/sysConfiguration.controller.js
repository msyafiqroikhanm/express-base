const ResponseFormatter = require('../helpers/responseFormatter.helper');
const {
  selectAllConfigurations,
  selectConfiguration,
  createConfiguration,
  updateConfiguration,
  deleteConfiguration,
} = require('../services/sysConfig.service');

class SysConfiguration {
  static async getAll(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const data = await selectAllConfigurations();

      const message = 'Success';
      return ResponseFormatter.success200(res, message, data);
    } catch (error) {
      next(error);
    }
  }

  static async getDetail(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;
      const data = await selectConfiguration(req.params.id);

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

      const data = await createConfiguration(req.body);
      if (!data.success) {
        return ResponseFormatter.error400(res, 'Invalid Data', [data.message]);
      }

      return ResponseFormatter.success201(res, 'System Configuration Successfully Created', data.content);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const data = await updateConfiguration(req.params.id, req.body);
      if (!data.success && data.code === 400) {
        return ResponseFormatter.error400(res, 'Invalid Data', [data.message]);
      }
      if (!data.success && data.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', [data.message]);
      }

      return ResponseFormatter.success200(res, 'System Configuration Successfully Updated', data.content);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const data = await deleteConfiguration(req.params.id);
      if (!data.success) {
        return ResponseFormatter.error404(res, 'Data Not Found', [data.message]);
      }

      return ResponseFormatter.success200(res, 'System Configuration Successfully Deleted', data.content);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = SysConfiguration;
