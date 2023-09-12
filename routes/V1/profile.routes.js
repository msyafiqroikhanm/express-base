const router = require('express').Router();
const { check } = require('express-validator');
const ValidateMiddleware = require('../../middlewares/validate.middleware');
const ProfileController = require('../../controllers/profile.controller');
const AuthMiddleware = require('../../middlewares/auth.middleware');

router.get(
  '/',
  async (req, res, next) => {
    AuthMiddleware.authenticate(
      req,
      res,
      next,
      null,
    );
  },
  ProfileController.get,
);

router.put(
  '/',
  async (req, res, next) => {
    AuthMiddleware.authenticate(
      req,
      res,
      next,
      null,
    );
  },
  [
    check('roleId', "RoleId attribute can't be empty").notEmpty(),
    check('participantId', "Participant Id attribute can't be empty").notEmpty(),
    check('email', "Email attribute can't be empty").notEmpty(),
  ],
  ValidateMiddleware.result,
  ProfileController.update,
);

router.put(
  '/change-password',
  async (req, res, next) => {
    AuthMiddleware.authenticate(
      req,
      res,
      next,
      null,
    );
  },
  [
    check('oldPassword', "Old Password attribute can't be empty").notEmpty(),
    check('newPassword', "New Password attribute can't be empty").notEmpty(),
    check('newRePassword', "New Re-Password attribute can't be empty").notEmpty(),
  ],
  ValidateMiddleware.result,
  ProfileController.changePassword,
);

module.exports = router;
