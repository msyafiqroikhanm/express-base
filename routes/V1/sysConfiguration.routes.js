const router = require('express').Router();
const { check } = require('express-validator');
const features = require('../../helpers/features.helper');
const configController = require('../../controllers/sysConfiguration.controller');
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
        feature.view_system_configuration,
        feature.create_system_configuration,
        feature.update_system_configuration,
        feature.delete_system_configuration,
      ]),
    );
  },
  configController.getAll,
);

router.get(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_system_configuration,
        feature.update_system_configuration,
        feature.delete_system_configuration,
      ]),
    );
  },
  configController.getDetail,
);

router.post(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.create_system_configuration,
      ]),
    );
  },
  [
    check('categoryId', 'Category attribute can\'t be empty').notEmpty(),
    check('name', 'Name attribute can\'t be empty').notEmpty(),
    check('value', 'Value attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  configController.create,
);

router.put(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.update_system_configuration,
      ]),
    );
  },
  [
    check('categoryId', 'Category attribute can\'t be empty').notEmpty(),
    check('name', 'Name attribute can\'t be empty').notEmpty(),
    check('value', 'Value attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  configController.update,
);

router.delete(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.delete_system_configuration,
      ]),
    );
  },
  configController.delete,
);

module.exports = router;
