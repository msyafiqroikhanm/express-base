const router = require('express').Router();
const { check } = require('express-validator');
const features = require('../../helpers/features.helper');
const ContingentController = require('../../controllers/continget.controller');
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
        feature.view_contingent,
        feature.create_contingent,
        feature.update_contingent,
        feature.delete_contingent,
      ]),
    );
  },
  ContingentController.getAll,
);

router.get(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_contingent,
        feature.update_contingent,
        feature.delete_contingent,
      ]),
    );
  },
  ContingentController.getDetail,
);

router.post(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.create_contingent,
      ]),
    );
  },
  [
    check('regionId', 'Region Id attribute can\'t be empty').notEmpty(),
    check('name', 'Name attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  ContingentController.create,
);

router.put(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.update_contingent,
      ]),
    );
  },
  [
    check('regionId', 'Region Id attribute can\'t be empty').notEmpty(),
    check('name', 'Name attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  ContingentController.update,
);

router.delete(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.delete_contingent,
      ]),
    );
  },
  ContingentController.delete,
);

module.exports = router;
