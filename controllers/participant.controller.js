const { relative } = require('path');
const { Op } = require('sequelize');
const deleteFile = require('../helpers/deleteFile.helper');
const ResponseFormatter = require('../helpers/responseFormatter.helper');
const {
  selectAllParticipant,
  selectParticipant,
  validateParticipantInputs,
  createParticipant,
  updateParticipant,
  deleteParticipant,
  trackingParticipant,
  createParticipantViaImport,
  validateCommitteeInputs,
  createComittee,
  updateCommittee,
  createCommitteeViaImport,
  selectParticipantAllSchedules,
  searchParticipant,
  selectAllNormalParticipants,
  selectAllCommitteeParticipants,
  downloadParticipantSecretFile,
} = require('../services/participant.service');
const { deleteFiles } = require('../helpers/deleteMultipleFile.helper');
const { createNotifications } = require('../services/notification.service');

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

  static async search(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      console.log(req.user.limitation);

      // resrict data that is not an admin
      const where = {
        [Op.or]: [
          { name: { [Op.substring]: req.params.search } },
          { email: { [Op.substring]: req.params.search } },
          { phoneNbr: { [Op.substring]: req.params.search } },
          { identityNo: { [Op.substring]: req.params.search } },
          // { address: { [Op.substring]: req.params.search } },
        ],
      };
      if (req.query?.typeId) {
        where.typeId = req.query.typeId;
      }

      console.log(JSON.stringify(req.user, null, 2));
      if (!req.user.limitation.isAdmin && req.user.Role?.name === 'Participant Coordinator') {
        where.id = req.user.limitation.access.contingentId;
      }

      const data = await searchParticipant(where);
      if (!data.success && data.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
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

      const inputs = await validateParticipantInputs(req.body, req.files, null, where);
      if (!inputs.isValid && inputs.code === 404) {
        // Delete uploaded files when error happens
        if (Object.keys(req.files).length > 0) {
          await deleteFiles(Object.values(req.files));
        }
        return ResponseFormatter.error404(res, 'Data Not Found', inputs.message);
      }
      if (!inputs.isValid && inputs.code === 401) {
        // Delete uploaded files when error happens
        if (Object.keys(req.files).length > 0) {
          await deleteFiles(Object.values(req.files));
        }
        return ResponseFormatter.error401(res, 'Unauthorized Request', inputs.message);
      }
      if (!inputs.isValid && inputs.code === 400) {
        // Delete uploaded files when error happens
        if (Object.keys(req.files).length > 0) {
          await deleteFiles(Object.values(req.files));
        }
        return ResponseFormatter.error400(res, 'Bad Request', inputs.message);
      }

      const data = await createParticipant(inputs.form);
      if (!data.success) {
        // Delete uploaded files when error happens
        if (Object.keys(req.files).length > 0) {
          await deleteFiles(Object.values(req.files));
        }
        return ResponseFormatter.error400(res, 'Bad Request', data.message);
      }

      const io = req.app.get('socketIo');
      await createNotifications(
        io,
        'Participant Created',
        data.content.id,
        [data.content.name],
      );

      return ResponseFormatter.success201(res, data.message, data.content);
    } catch (error) {
      // Delete uploaded files when error happens
      if (Object.keys(req.files).length > 0) {
        await deleteFiles(Object.values(req.files));
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
        return ResponseFormatter.error400(res, data.message, data.content);
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

      const inputs = await validateParticipantInputs(req.body, req.files, req.params.id, where);
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

      const data = await updateParticipant(req.params.id, inputs.form, where);
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

      const io = req.app.get('socketIo');
      await createNotifications(
        io,
        'Participant Created',
        data.content.id,
        [data.content.name],
      );

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
        if (data.filePath) {
          res.download(data.filePath);
        }
        return ResponseFormatter.error400(res, data.message, data.content);
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

      const data = await selectParticipantAllSchedules(req.params.id, where);
      if (!data.success && data.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async getAllParticipants(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      // resrict data that is not an admin
      const where = {};
      if (!req.user.limitation.isAdmin) {
        where.contingentId = req.user.limitation.access.contingentId;
      }

      const data = await selectAllNormalParticipants(where);
      if (!data.success) {
        return ResponseFormatter.error400(res, 'Bad Request', data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async getAllCommittees(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const data = await selectAllCommitteeParticipants();
      if (!data.success) {
        return ResponseFormatter.error400(res, 'Bad Request', data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async getSecretFile(req, res, next) {
    try {
      // resrict data that is not an admin
      const where = {};
      if (!req.user?.limitation.isAdmin) {
        where.contingentId = req.user.limitation.access.contingentId;
      }
      if (!req.user?.limitation.isAdmin
          && req.user?.Role.name?.toLowerCase() === 'pic participant'
          && req.user.participantId !== req.params.id) {
        return ResponseFormatter.error401(res, "Can't Access File That Belongs To Another Participant");
      }

      const data = await downloadParticipantSecretFile(req.params.id, req.params.file, where);
      if (!data.success && data.code === 400) {
        return ResponseFormatter.error400(res, 'Bad Request', data.message);
      }
      if (!data.success && data.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }

      res.setHeader('Access-Control-Expose-Headers', 'filename');
      res.setHeader('filename', data.filename);

      return res.download(data.filePath);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Participant;
