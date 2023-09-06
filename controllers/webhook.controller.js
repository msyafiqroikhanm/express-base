const { verifyWebhook, receiveWebhook } = require('../services/webhook.service');

class WebhookController {
  static async verify(req, res, next) {
    try {
      const data = await verifyWebhook(req.query);
      if (!data.success) {
        return res.sendStatus(403);
      }
      return res.status(200).send(data.content);
    } catch (error) {
      next(error);
    }
  }

  static async receive(req, res, next) {
    try {
      if (await receiveWebhook(req.body)) {
        return res.sendStatus(200);
      }
      return res.sendStatus(400);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = WebhookController;
