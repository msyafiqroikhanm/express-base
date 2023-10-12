const { deleteFiles } = require('../helpers/deleteMultipleFile.helper');
const ResponseFormatter = require('../helpers/responseFormatter.helper');
const {
  selectDetailUser, validatePasswordInputs, updateUserPassword, validateProfileInputs,
  updateUserProfile,
} = require('../services/user.service');

class ProfileController {
  static async get(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const data = await selectDetailUser(req.user.id);
      if (!data.success) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const inputs = await validateProfileInputs(req.body, req.user.id, req.files);
      if (!inputs.isValid && inputs.code === 404) {
        // Delete uploaded files when error happens
        if (Object.keys(req.files).length > 0) {
          await deleteFiles(Object.values(req.files));
        }
        return ResponseFormatter.error404(res, 'Data Not Found', inputs.message);
      }
      if (!inputs.isValid && inputs.code === 400) {
        // Delete uploaded files when error happens
        if (Object.keys(req.files).length > 0) {
          await deleteFiles(Object.values(req.files));
        }
        return ResponseFormatter.error400(res, 'Bad Request', inputs.message);
      }

      const data = await updateUserProfile(inputs.form, req.user.id);
      if (!data.success && data.code === 404) {
        // Delete uploaded files when error happens
        if (Object.keys(req.files).length > 0) {
          await deleteFiles(Object.values(req.files));
        }
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      // Delete uploaded files when error happens
      if (Object.keys(req.files).length > 0) {
        await deleteFiles(Object.values(req.files));
      }
      next(error);
    }
  }

  static async changePassword(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const inputs = await validatePasswordInputs(req.user.id, req.body);
      if (!inputs.isValid && inputs.code === 400) {
        return ResponseFormatter.error400(res, 'Bad Request', inputs.message);
      }
      if (!inputs.isValid && inputs.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', inputs.message);
      }

      const data = await updateUserPassword(inputs.form);
      if (!data.success) {
        return ResponseFormatter.error400(res, 'Bad Request', data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProfileController;
