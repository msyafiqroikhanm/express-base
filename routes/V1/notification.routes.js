const router = require('express').Router();
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

module.exports = router;
