const ResponseFormatter = require('../helpers/responseFormatter.helper');
const { selectAllNotification, updateNotifications } = require('../services/notification.service');

class Notification {
  static async getAll(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const data = await selectAllNotification(req.user.id);

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const data = await updateNotifications(req.user.id, req.body?.notifications || []);
      if (!data.success) {
        return ResponseFormatter.InternalServerError(res, data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Notification;
