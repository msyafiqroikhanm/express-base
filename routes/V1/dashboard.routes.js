const router = require('express').Router();
const Authentication = require('../../middlewares/auth.middleware');
const DashboardController = require('../../controllers/dashboard.controller');
const AuthMiddleware = require('../../middlewares/auth.middleware');

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
  AuthMiddleware.dashboard,
  DashboardController.get,
);

module.exports = router;
