const { relative } = require('path');
const { validationResult } = require('express-validator');
const ResponseFormatter = require('../helpers/responseFormatter.helper');
const deleteFile = require('../helpers/deleteFile.helper');

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

        // Delete uploaded file when error happens
        if (req.file && !req.file.buffer) {
          await deleteFile(relative(__dirname, req.file.path));
        }
        return ResponseFormatter.error400(res, 'Data Not Complete', resErrors);
      }
      next();
    } catch (error) {
      next(error);
    }
  }

  static async resultWithMandatoryFile(req, res, next) {
    try {
      res.url = req.originalUrl;

      const errors = validationResult(req);
      if (!errors.isEmpty() || !req.file) {
        const resErrors = [];
        errors.errors.forEach((element) => {
          resErrors.push(element.msg);
        });

        if (!req.file) {
          resErrors.push('Missing Mandatory File, File Required');
        }

        // Delete uploaded file when error happens
        if (req.file) {
          await deleteFile(relative(__dirname, req.file.path));
        }
        return ResponseFormatter.error400(res, 'Data Not Complete', resErrors);
      }
      next();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ValidateMiddleware;
