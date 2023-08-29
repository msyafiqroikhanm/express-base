const router = require('express').Router();
const { check } = require('express-validator');
const features = require('../../helpers/features.helper');
const roleController = require('../../controllers/role.controller');
const ValidateMiddleware = require('../../middlewares/validate.middleware');
const Authentication = require('../../middlewares/auth.middleware');

router.get(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_role,
        feature.create_role,
        feature.update_role,
        feature.delete_role,
      ]),
    );
  },
  roleController.getAll,
);

router.get(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_role,
        feature.update_role,
        feature.delete_role,
      ]),
    );
  },
  roleController.getDetail,
);

router.post(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.create_role,
      ]),
    );
  },
  [
    check('name', 'Name attribute can\'t be empty').notEmpty(),
    check('templateId', 'QR Template attribute can\'t be empty').notEmpty(),
    check('features', 'Feature attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  roleController.create,
);

router.put(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.update_role,
      ]),
    );
  },
  [
    check('name', 'Name attribute can\'t be empty').notEmpty(),
    check('templateId', 'QR Template attribute can\'t be empty').notEmpty(),
    check('features', 'Feature attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  roleController.update,
);

router.delete(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.delete_role,
      ]),
    );
  },
  roleController.delete,
);

module.exports = router;
