const { relative } = require('path');
const deleteFile = require('../helpers/deleteFile.helper');
const ResponseFormatter = require('../helpers/responseFormatter.helper');
const {
  selectAllParticipant, selectParticipant, validateParticipantInputs,
  createParticipant, updateParticipant, deleteParticipant, trackingParticipant,
  createParticipantViaImport,
} = require('../services/participant.service');

class Participant {
  static async getAll(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const data = await selectAllParticipant();
      if (!data.success) {
        return ResponseFormatter.error400(res, 'Bad Request', data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async getDetail(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const data = await selectParticipant(req.params.id);
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

      const inputs = await validateParticipantInputs(req.body, req.file);
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

      const data = await createParticipant(inputs.form);
      if (!data.success) {
        return ResponseFormatter.error400(res, 'Bad Request', data.content);
      }

      return ResponseFormatter.success201(res, data.message, data.content);
    } catch (error) {
      // Delete uploaded file when error happens
      if (req.file) {
        await deleteFile(relative(__dirname, req.file.path));
      }
      next(error);
    }
  }

  static async createViaImport(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const data = await createParticipantViaImport(req.file);
      if (!data.success && data.code === 400) {
        // Delete uploaded file when error happens
        if (req.file) {
          await deleteFile(relative(__dirname, req.file.path));
        }
        return ResponseFormatter.error400(res, 'Bad Request', data.message);
      }

      // Delete uploaded file when error happens
      if (req.file) {
        await deleteFile(relative(__dirname, req.file.path));
      }
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

      const inputs = await validateParticipantInputs(req.body, req.file, req.params.id);
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

      const data = await updateParticipant(req.params.id, inputs.form);
      if (!data.success && data.code === 404) {
        // Delete uploaded file when error happens
        if (req.file) {
          await deleteFile(relative(__dirname, req.file.path));
        }
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

      const data = await deleteParticipant(req.params.id);
      if (!data.success && data.code === 404) {
        return ResponseFormatter.error404(res, data.message, data.content);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async track(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const data = await trackingParticipant(req.body);
      if (!data.success && data.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }

      return ResponseFormatter.success201(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Participant;
