const router = require('express').Router();
const { check } = require('express-validator');
const features = require('../../helpers/features.helper');
const featureController = require('../../controllers/feature.controller');
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
        feature.view_feature,
        feature.create_feature,
        feature.update_feature,
        feature.delete_feature,
        feature.create_role,
        feature.update_role,
      ]),
    );
  },
  featureController.getAll,
);

router.get(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_feature,
        feature.update_feature,
        feature.delete_feature,
        feature.create_role,
        feature.update_role,
      ]),
    );
  },
  featureController.getDetail,
);

router.post(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.create_feature,
      ]),
    );
  },
  [
    check('moduleId', 'moduleId attribute can\'t be empty').notEmpty(),
    check('name', 'Name attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  featureController.create,
);

router.put(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.update_feature,
      ]),
    );
  },
  [
    check('moduleId', 'moduleId attribute can\'t be empty').notEmpty(),
    check('name', 'Name attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  featureController.update,
);

router.delete(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.delete_feature,
      ]),
    );
  },
  featureController.delete,
);

module.exports = router;
