const { relative } = require('path');
const deleteFile = require('../helpers/deleteFile.helper');
const ResponseFormatter = require('../helpers/responseFormatter.helper');
const {
  selectAllParticipant, selectParticipant, validateParticipantInputs,
  createParticipant, updateParticipant, deleteParticipant, trackingParticipant,
  createParticipantViaImport, validateCommitteeInputs, createComittee, updateCommittee,
  createCommitteeViaImport, selectParticipantAllSchedules,
} = require('../services/participant.service');

class Participant {
  static async getAll(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      // resrict data that is not an admin
      const where = {};
      if (!req.user.limitation.isAdmin) {
        where.id = req.user.limitation.access.contingentId;
      }

      const data = await selectAllParticipant(req.query, where);
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

      // resrict data that is not an admin
      const where = {};
      if (!req.user.limitation.isAdmin) {
        where.id = req.user.limitation.access.contingentId;
      }

      const data = await selectParticipant(req.params.id, where);
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

      // resrict data that is not an admin
      const where = {};
      if (!req.user.limitation.isAdmin) {
        where.id = req.user.limitation.access.contingentId;
      }

      const inputs = await validateParticipantInputs(req.body, req.file, null, where);
      if (!inputs.isValid && inputs.code === 404) {
        // Delete uploaded file when error happens
        if (req.file) {
          await deleteFile(relative(__dirname, req.file.path));
        }
        return ResponseFormatter.error404(res, 'Data Not Found', inputs.message);
      }
      if (!inputs.isValid && inputs.code === 401) {
        // Delete uploaded file when error happens
        if (req.file) {
          await deleteFile(relative(__dirname, req.file.path));
        }
        return ResponseFormatter.error401(res, 'Unauthorized Request', inputs.message);
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

      // Delete uploaded file after success create participant in bulk
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

      // resrict data that is not an admin
      const where = {};
      if (!req.user.limitation.isAdmin) {
        where.id = req.user.limitation.access.contingentId;
      }

      const inputs = await validateParticipantInputs(req.body, req.file, req.params.id, where);
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

      const data = await updateParticipant(req.params.id, inputs.form, where);
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

      // resrict data that is not an admin
      const where = { id: req.params.id };
      if (!req.user.limitation.isAdmin) {
        where.contingentId = req.user.limitation.access.contingentId;
      }

      const data = await deleteParticipant(where);
      if (!data.success && data.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
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

  static async createCommittee(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const inputs = await validateCommitteeInputs(req.body, req.file, null);
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

      const data = await createComittee(inputs.form);
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

  static async updateCommittee(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const inputs = await validateCommitteeInputs(req.body, req.file, req.params.id);
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

      const data = await updateCommittee(req.params.id, inputs.form);
      if (!data.success && data.code === 404) {
        // Delete uploaded file when error happens
        if (req.file) {
          await deleteFile(relative(__dirname, req.file.path));
        }
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async createCommitteeViaImport(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const data = await createCommitteeViaImport(req.file);
      if (!data.success && data.code === 400) {
        // Delete uploaded file when error happens
        if (req.file) {
          await deleteFile(relative(__dirname, req.file.path));
        }
        return ResponseFormatter.error400(res, 'Bad Request', data.message);
      }

      // Delete uploaded file after success create committee in bulk
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

  static async TransportationSchedule(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      // resrict data that is not an admin
      const where = {};
      if (!req.user.limitation.isAdmin) {
        where.id = req.user.limitation.access.contingentId;
      }

      console.log(where);

      const data = await selectParticipantAllSchedules(req.params.id, where);
      if (!data.success && data.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Participant;
