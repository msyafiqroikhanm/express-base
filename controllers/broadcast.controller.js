const { relative } = require('path');
const deleteFile = require('../helpers/deleteFile.helper');
const ResponseFormatter = require('../helpers/responseFormatter.helper');
const {
  selectAllBroadcasts,
  selectBroadcast,
  validateBroadcastInputs,
  createBroadcast,
  scheduleBroadcast,
  updateBroadcast,
  deleteBroadcast,
} = require('../services/broadcast.service');

class BroadcastController {
  static async getAll(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;
      res.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

      const data = await selectAllBroadcasts();

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async getDetail(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;
      res.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

      const data = await selectBroadcast(req.params.id);
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
      res.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

      const inputs = await validateBroadcastInputs(req.body, req.file);
      if (!inputs.isValid && inputs.code === 400) {
        // Delete uploaded file when error happens
        if (req.file) {
          await deleteFile(relative(__dirname, req.file.path));
        }
        return ResponseFormatter.error400(res, 'Bad Request', inputs.message);
      }
      if (!inputs.isValid && inputs.code === 404) {
        // Delete uploaded file when error happens
        if (req.file) {
          await deleteFile(relative(__dirname, req.file.path));
        }
        return ResponseFormatter.error404(res, 'Data Not Found', inputs.message);
      }

      const data = await createBroadcast(inputs.form);

      const io = req.app.get('socketIo');
      await scheduleBroadcast(data.content.id, io);

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
      res.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

      const inputs = await validateBroadcastInputs(req.body, req.file);
      if (!inputs.isValid && inputs.code === 400) {
        // Delete uploaded file when error happens
        if (req.file) {
          await deleteFile(relative(__dirname, req.file.path));
        }
        return ResponseFormatter.error400(res, 'Bad Request', inputs.message);
      }
      if (!inputs.isValid && inputs.code === 404) {
        // Delete uploaded file when error happens
        if (req.file) {
          await deleteFile(relative(__dirname, req.file.path));
        }
        return ResponseFormatter.error404(res, 'Data Not Found', inputs.message);
      }

      const data = await updateBroadcast(inputs.form, req.params.id);
      if (!data.success && data.code === 400) {
        // Delete uploaded file when error happens
        if (req.file) {
          await deleteFile(relative(__dirname, req.file.path));
        }
        return ResponseFormatter.error400(res, 'Bad Request', data.message);
      }
      if (!data.success && data.code === 404) {
        // Delete uploaded file when error happens
        if (req.file) {
          await deleteFile(relative(__dirname, req.file.path));
        }
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }

      await scheduleBroadcast(data.content.id);

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
      res.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

      const data = await deleteBroadcast(req.params.id);
      if (!data.success && data.code === 400) {
        return ResponseFormatter.error400(res, 'Bad Request', data.message);
      }
      if (!data.success && data.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BroadcastController;
