const ResponseFormatter = require('../helpers/responseFormatter.helper');
const { generateTransportationReport, generateEventReport } = require('../services/report.service');

class ReportController {
  static async getParticipantReport(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;
    } catch (error) {
      next(error);
    }
  }

  static async getTransportationReport(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      // resrict data that is not an admin
      const where = {};
      if (!req.user.limitation.isAdmin && req.user.limitation?.access?.picId) {
        where.picId = req.user.limitation.access.picId;
        where.vendors = req.user.limitation.access.vendors;
      }

      const data = await generateTransportationReport(where);

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async getEventReport(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      // resrict data that is not an admin
      const where = {};
      if (!req.user.limitation.isAdmin && req.user.limitation?.access?.picId && req.user.Role.name !== 'Admin Event') {
        where.picId = req.user.limitation.access.picId;
        where.events = req.user.limitation.access.events;
      }

      console.log(where);

      const data = await generateEventReport(where);

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async getAccomodationReport(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;
    } catch (error) {
      next(error);
    }
  }

  static async getFnBReport(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ReportController;
