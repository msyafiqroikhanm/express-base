const ResponseFormatter = require('../helpers/responseFormatter.helper');
const LoggerService = require('../services/logger.service');
const {
  selectAllConfigCategories, selectConfiCategory, createSysConfigCategory, updateSysConfigCategory,
} = require('../services/reference.service');

class SysConfigCategory {
  static async getAll(req, res, next) {
    try {
      const logger = new LoggerService(`${req.method} ${req.originalUrl}`);

      const data = await selectAllConfigCategories();

      const message = 'Success';
      logger.info(message, data);
      return ResponseFormatter.success200(res, message, data);
    } catch (error) {
      next(error);
    }
  }

  static async getDetail(req, res, next) {
    try {
      const logger = new LoggerService(`${req.method} ${req.originalUrl}`);

      const data = await selectConfiCategory(req.params.id);
      if (!data) {
        const message = 'System Configuration Category Data Not Found';
        logger.warn(message, data);
        return ResponseFormatter.error404(res, message);
      }

      const message = 'System Configuration Category Data Found';
      logger.info(message, data);
      return ResponseFormatter.success200(res, message, data);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const logger = new LoggerService(`${req.method} ${req.originalUrl}`);
      const data = await createSysConfigCategory(req.body);

      const message = 'New System Configuration Category Successfully Created';
      logger.info(message, data);
      return ResponseFormatter.success201(res, message, data);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const logger = new LoggerService(`${req.method} ${req.originalUrl}`);
      const data = await updateSysConfigCategory(req.params.id, req.body);

      const message = 'System Configuration Category Successfully Updated';
      logger.info(message, data);
      return ResponseFormatter.success200(res, message, data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  SysConfigCategory,
};
