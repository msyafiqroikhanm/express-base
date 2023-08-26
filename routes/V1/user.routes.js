const router = require('express').Router();
const { check } = require('express-validator');
const features = require('../../helpers/features.helper');
const userController = require('../../controllers/user.controller');
const ValidateMiddleware = require('../../middlewares/validate.middleware');
const Authentication = require('../../middlewares/auth.middleware');

router.get(
  '/',
  Authentication.authenticate,
  async (req, res, next) => {
    Authentication.authorization(
      req,
      res,
      next,
      await features().then((feature) => feature.view_user),
    );
  },
  userController.getAll,
);

router.get(
  '/:id',
  Authentication.authenticate,
  async (req, res, next) => {
    Authentication.authorization(
      req,
      res,
      next,
      await features().then((feature) => feature.view_user),
    );
  },
  userController.getDetail,
);

router.post(
  '/',
  Authentication.authenticate,
  async (req, res, next) => {
    Authentication.authorization(
      req,
      res,
      next,
      await features().then((feature) => feature.create_user),
    );
  },
  [
    check('roleId', 'RoleId attribute can\'t be empty').notEmpty(),
    check('name', 'Name attribute can\'t be empty').notEmpty(),
    check('username', 'Username attribute can\'t be empty').notEmpty(),
    check('password', 'Password attribute can\'t be empty').notEmpty(),
    check('email', 'Email attribute can\'t be empty').notEmpty(),
    check('phoneNbr', 'Phone Number attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  userController.create,
);

router.put(
  '/:id',
  Authentication.authenticate,
  async (req, res, next) => {
    Authentication.authorization(
      req,
      res,
      next,
      await features().then((feature) => feature.update_user),
    );
  },
  [
    check('roleId', 'RoleId attribute can\'t be empty').notEmpty(),
    check('name', 'Name attribute can\'t be empty').notEmpty(),
    check('email', 'Email attribute can\'t be empty').notEmpty(),
    check('phoneNbr', 'Phone Number attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  userController.update,
);

router.delete(
  '/:id',
  Authentication.authenticate,
  async (req, res, next) => {
    Authentication.authorization(
      req,
      res,
      next,
      await features().then((feature) => feature.delete_user),
    );
  },
  userController.delete,
);

router.put(
  '/:id/change-password',
  Authentication.authenticate,
  async (req, res, next) => {
    Authentication.authorization(
      req,
      res,
      next,
      await features().then((feature) => feature.change_password),
    );
  },
  [
    check('oldPassword', 'Old Password attribute can\'t be empty').notEmpty(),
    check('newPassword', 'New Password attribute can\'t be empty').notEmpty(),
    check('newRePassword', 'New Re-Password attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  userController.changePassword,
);

module.exports = router;
