const router = require('express').Router();
const { check } = require('express-validator');
const features = require('../../helpers/features.helper');
const moduleController = require('../../controllers/module.controller');
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
        feature.view_module,
        feature.create_module,
        feature.update_module,
        feature.delete_module,
        feature.create_feature,
        feature.update_feature,
      ]),
    );
  },
  moduleController.getAll,
);

router.get(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_module,
        feature.update_module,
        feature.delete_module,
        feature.create_feature,
        feature.update_feature,
      ]),
    );
  },
  moduleController.getDetail,
);

router.post(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.create_module,
      ]),
    );
  },
  [
    check('name', 'Name attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  moduleController.createMain,
);

router.post(
  '/sub',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.create_module,
      ]),
    );
  },
  [
    check('parentModuleId', 'Parent Module Id attribute must be integer').isInt(),
    check('name', 'Name attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  moduleController.createSub,
);

router.put(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.update_module,
      ]),
    );
  },
  [
    check('name', 'Name attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  moduleController.update,
);

router.put(
  '/sub/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.update_module,
      ]),
    );
  },
  [
    check('parentModuleId', 'Parent Module Id attribute must be integer').isInt(),
    check('name', 'Name attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  moduleController.updateSub,
);

router.delete(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.delete_module,
      ]),
    );
  },
  moduleController.delete,
);

module.exports = router;
