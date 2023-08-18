const { validationResult } = require('express-validator');
const ResponseFormatter = require('../helpers/responseFormatter.helper');

class ValidateMiddleware {
  static async result(req, res, next) {
    try {
      res.url = req.originalUrl;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const resErrors = [];
        errors.errors.forEach((element) => {
          resErrors.push(element.msg);
        });
        return ResponseFormatter.error400(res, 'Data tidak lengkap', resErrors);
      }
      next();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ValidateMiddleware;
