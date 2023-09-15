const ResponseFormatter = require('../helpers/responseFormatter.helper');
const { selectDashboard } = require('../services/dashboard.service');

class DashboardController {
  static async get(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const modules = req.user.Role.modules.map((module) => module.parentModule);

      // resrict data that is not an admin
      const limitation = req.user.limitation.isAdmin ? null : req.user.limitation.access;

      const data = await selectDashboard(limitation, modules);

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = DashboardController;
