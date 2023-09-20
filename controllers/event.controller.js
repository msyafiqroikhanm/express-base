const ResponseFormatter = require('../helpers/responseFormatter.helper');
const {
  selectAllEvents, selectEvent, validateEventInputs, createEvent, updateEvent,
  deleteEvent, selectAllGroupOfEvent, updateProgressGroup,
} = require('../services/event.service');

class Events {
  static async getAll(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      // resrict data that is not an admin
      const where = {};
      if (!req.user.limitation.isAdmin && req.user.limitation?.access?.picId) {
        where.picId = req.user.limitation.access.picId;
        where.events = req.user.limitation.access.events;
      }

      const data = await selectAllEvents(where);

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
      if (!req.user.limitation.isAdmin && req.user.limitation?.access?.picId) {
        where.picId = req.user.limitation.access.picId;
        where.events = req.user.limitation.access.events;
      }

      const data = await selectEvent(req.params.id, where);
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

      const inputs = await validateEventInputs(req.body);
      if (!inputs.isValid && inputs.code === 400) {
        return ResponseFormatter.error400(res, 'Bad Request', inputs.message);
      }
      if (!inputs.isValid && inputs.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', inputs.message);
      }

      const data = await createEvent(inputs.form);

      return ResponseFormatter.success201(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const inputs = await validateEventInputs(req.body);
      if (!inputs.isValid && inputs.code === 400) {
        return ResponseFormatter.error400(res, 'Bad Request', inputs.message);
      }
      if (!inputs.isValid && inputs.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', inputs.message);
      }

      const data = await updateEvent(req.params.id, inputs.form);
      if (!data.success && data.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', inputs.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      // resrict data that is not an admin
      const where = {};
      if (!req.user.limitation.isAdmin && req.user.limitation?.access?.picId) {
        where.picId = req.user.limitation.access.picId;
        where.events = req.user.limitation.access.events;
      }

      const data = await deleteEvent(req.params.id, where);
      if (!data.success && data.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async getGroup(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      // resrict data that is not an admin
      const where = {};
      if (!req.user.limitation.isAdmin && req.user.limitation?.access?.picId) {
        where.picId = req.user.limitation.access.picId;
        where.events = req.user.limitation.access.events;
      }

      const data = await selectAllGroupOfEvent(req.params.id, where);
      if (!data.success && data.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async progressGroup(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      // resrict data that is not an admin
      const where = {};
      if (!req.user.limitation.isAdmin && req.user.limitation?.access?.picId) {
        where.picId = req.user.limitation.access.picId;
        where.events = req.user.limitation.access.events;
      }

      const data = await updateProgressGroup(req.body, req.params.id, where);
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

module.exports = Events;
