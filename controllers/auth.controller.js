const { loginService } = require('../services/login.service');
const ResponseFormatter = require('../helpers/responseFormatter.helper');
const LoggerService = require('../services/logger.service');

class AuthController {
  static async login(req, res, next) {
    try {
      const logger = new LoggerService(`${req.method} ${req.originalUrl}`);
      const data = await loginService(req.username, req.password);

      const message = 'Berhasil Login';
      logger.info(message, data);
      return ResponseFormatter.success(res, 200, 'OK', message, data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
