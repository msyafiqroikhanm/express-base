const router = require('express').Router();
const { check } = require('express-validator');
const ValidateMiddleware = require('../../middlewares/validate.middleware');
const NotificationController = require('../../controllers/notification.controller');
const Authentication = require('../../middlewares/auth.middleware');

router.get(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      null,
    );
  },
  Authentication.participant,
  NotificationController.getAll,
);

router.put(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      null,
    );
  },
  Authentication.participant,
  [
    check('notifications', 'Notifications attribute must be an array').isArray(),
  ],
  ValidateMiddleware.result,
  NotificationController.update,
);

module.exports = router;
