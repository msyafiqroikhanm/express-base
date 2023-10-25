const router = require('express').Router();
const { check } = require('express-validator');
const features = require('../../helpers/features.helper');
const ValidateMiddleware = require('../../middlewares/validate.middleware');
const Authentication = require('../../middlewares/auth.middleware');
const UserController = require('../../controllers/user.controller');

router.get(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_user,
        feature.create_user,
        feature.update_user,
        feature.delete_user,
        feature.change_password,
      ]),
    );
  },
  UserController.getAll,
);

router.get(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_user,
        feature.update_user,
        feature.delete_user,
        feature.change_password,
      ]),
    );
  },
  UserController.getDetail,
);

router.post(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.create_user]),
    );
  },
  [
    check('roleId', "RoleId attribute can't be empty").notEmpty(),
    check('participantId', "Participant Id attribute can't be empty").notEmpty(),
    check('username', "Username attribute can't be empty").notEmpty(),
    check('password', "Password attribute can't be empty").notEmpty(),
    // check('email', "Email attribute can't be empty").notEmpty(),
  ],
  ValidateMiddleware.result,
  UserController.create,
);

router.put(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.update_user]),
    );
  },
  [
    check('roleId', "RoleId attribute can't be empty").notEmpty(),
    check('participantId', "Participant Id attribute can't be empty").notEmpty(),
    // check('email', "Email attribute can't be empty").notEmpty(),
  ],
  ValidateMiddleware.result,
  UserController.update,
);

router.delete(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.delete_user]),
    );
  },
  UserController.delete,
);

router.put(
  '/:id/change-password',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.change_password]),
    );
  },
  [
    check('oldPassword', "Old Password attribute can't be empty").notEmpty(),
    check('newPassword', "New Password attribute can't be empty").notEmpty(),
    check('newRePassword', "New Re-Password attribute can't be empty").notEmpty(),
  ],
  ValidateMiddleware.result,
  UserController.changePassword,
);

router.post(
  '/public',
  [
    check('username', "Username attribute can't be empty").notEmpty(),
    check('password', "Password attribute can't be empty").notEmpty(),
    check('rePassword', "Verify password attribute can't be empty").notEmpty(),
    // check('email', "Email attribute can't be empty").notEmpty(),
    check('identityType', "Identity type attribute can't be empty").notEmpty(),
    check('identityNo', "Identity number attribute can't be empty").notEmpty(),
    check('phoneNbr', "Phone number attribute can't be empty").notEmpty(),
  ],
  ValidateMiddleware.result,
  UserController.registerPublic,
);

router.put(
  '/:id/reset-password',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.change_password]),
    );
  },
  [
    check('newPassword', "New Password attribute can't be empty").notEmpty(),
    check('newRePassword', "New Re-Password attribute can't be empty").notEmpty(),
  ],
  ValidateMiddleware.result,
  UserController.changePassword,
);

module.exports = router;
