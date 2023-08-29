const { relative } = require('path');
const deleteFile = require('../helpers/deleteFile.helper');
const ResponseFormatter = require('../helpers/responseFormatter.helper');
const {
  selectAllUsers, createUser, validateUserInputs, updateUser,
  deleteUser, validatePasswordInputs, updateUserPassword, selectDetailUser,
} = require('../services/user.service');

class User {
  static async getAll(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const data = await selectAllUsers();

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async getDetail(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const data = await selectDetailUser(req.params.id);
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

      const inputs = await validateUserInputs(req.body, req.file);
      if (!inputs.isValid && inputs.code === 404) {
        // Delete uploaded file when error happens
        if (req.file) {
          await deleteFile(relative(__dirname, req.file.path));
        }
        return ResponseFormatter.error404(res, 'Data Not Found', inputs.message);
      }
      if (!inputs.isValid && inputs.code === 400) {
        // Delete uploaded file when error happens
        if (req.file) {
          await deleteFile(relative(__dirname, req.file.path));
        }
        return ResponseFormatter.error400(res, 'Bad Request', inputs.message);
      }

      const data = await createUser(inputs.form);

      return ResponseFormatter.success201(res, data.message, data.content);
    } catch (error) {
      // Delete uploaded file when error happens
      if (req.file) {
        await deleteFile(relative(__dirname, req.file.path));
      }
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const inputs = await validateUserInputs(req.body, req.file);
      if (!inputs.isValid && inputs.code === 404) {
        // Delete uploaded file when error happens
        if (req.file) {
          await deleteFile(relative(__dirname, req.file.path));
        }
        return ResponseFormatter.error404(res, 'Data Not Found', inputs.message);
      }
      if (!inputs.isValid && inputs.code === 400) {
        // Delete uploaded file when error happens
        if (req.file) {
          await deleteFile(relative(__dirname, req.file.path));
        }
        return ResponseFormatter.error400(res, 'Bad Request', inputs.message);
      }

      const data = await updateUser(req.params.id, inputs.form);
      if (!data.success && data.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      // Delete uploaded file when error happens
      if (req.file) {
        await deleteFile(relative(__dirname, req.file.path));
      }
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const data = await deleteUser(req.params.id);
      if (!data.success && data.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const inputs = await validatePasswordInputs(req.params.id, req.body);
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

module.exports = User;
