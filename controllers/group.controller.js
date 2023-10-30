const ResponseFormatter = require('../helpers/responseFormatter.helper');
const {
  selectAllGroups,
  selectGroup,
  validateGroupInputs,
  createGroup,
  updateGroup,
  deleteGroup,
  validateGroupProgressInputs,
  updateGroupProgress,
} = require('../services/group.service');
const { createNotifications } = require('../services/notification.service');
const { ENV_Event } = require('../models');

class ParticipantGroup {
  static async getAll(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;
      res.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

      const where = {};
      //* Filtering
      if (req.query?.statusId) {
        where.statusId = req.query.statusId;
      }
      if (req.query?.contingentId) {
        where.contingentId = req.query.contingentId;
      }
      if (req.query?.eventId) {
        where.eventId = req.query.eventId;
      }

      // resrict data that is not an admin
      if (!req.user.limitation.isAdmin) {
        where.contingentId = req.user.limitation.access.contingentId;
      }

      if (req.user?.PIC[0]?.REF_PICType?.name === 'PIC Event') {
        const events = await ENV_Event.findAll({
          where: { picId: req.user?.PIC[0]?.id },
          attributes: ['id'],
        });

        const eventIds = events.map((event) => event.id);
        where.eventIds = eventIds;
      }

      const data = await selectAllGroups(where);
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
      res.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

      // resrict data that is not an admin
      const where = {};
      if (!req.user.limitation.isAdmin) {
        where.id = req.user.limitation.access.contingentId;
      }

      const data = await selectGroup(req.params.id, where);
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

      // resrict data that is not an admin
      const where = {};
      if (!req.user.limitation.isAdmin) {
        where.id = req.user.limitation.access.contingentId;
      }

      const inputs = await validateGroupInputs(req.body, null, where);
      if (!inputs.isValid && inputs.code === 400) {
        return ResponseFormatter.error400(res, 'Bad Request', inputs.message);
      }
      if (!inputs.isValid && inputs.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', inputs.message);
      }

      const data = await createGroup(inputs.form);
      if (!data.success) {
        return ResponseFormatter.error400(res, 'Bad Request', data.message);
      }

      const io = req.app.get('socketIo');
      await createNotifications(io, 'Group Created', data.content.id, [data.content.name]);

      return ResponseFormatter.success201(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;
      res.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

      // resrict data that is not an admin
      const where = {};
      if (!req.user.limitation.isAdmin) {
        where.id = req.user.limitation.access.contingentId;
      }

      const inputs = await validateGroupInputs(req.body, req.params.id, where);
      if (!inputs.isValid && inputs.code === 400) {
        return ResponseFormatter.error400(res, 'Bad Request', inputs.message);
      }
      if (!inputs.isValid && inputs.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', inputs.message);
      }

      const data = await updateGroup(req.params.id, inputs.form, where);
      if (!data.success && data.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;
      res.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

      // resrict data that is not an admin
      const where = {};
      if (!req.user.limitation.isAdmin) {
        where.id = req.user.limitation.access.contingentId;
      }

      const data = await deleteGroup(req.params.id, where);
      if (!data.success && data.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async progress(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;
      res.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

      const inputs = await validateGroupProgressInputs(req.body, req.params.id);
      if (!inputs.isValid && inputs.code === 400) {
        return ResponseFormatter.error400(res, 'Bad Request', inputs.message);
      }
      if (!inputs.isValid && inputs.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', inputs.message);
      }

      const data = await updateGroupProgress(inputs.form, req.params.id);

      const io = req.app.get('socketIo');
      await createNotifications(io, 'Group Progress', data.content.id, [
        data.content.name || data.content.id,
        data.content.status,
      ]);

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ParticipantGroup;
