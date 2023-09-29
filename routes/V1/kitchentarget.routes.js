const router = require('express').Router();
const { check } = require('express-validator');
const features = require('../../helpers/features.helper');
const Authentication = require('../../middlewares/auth.middleware');
const ValidateMiddleware = require('../../middlewares/validate.middleware');
const KitchenTargetController = require('../../controllers/kitchenTarget.controller');

router.get(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_kitchen_target,
        feature.create_kitchen_target,
        feature.update_kitchen_target,
        feature.delete_kitchen_target,
      ]),
    );
  },
  Authentication.fnb,
  KitchenTargetController.getAll,
);

router.get(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_kitchen_target,
        feature.create_kitchen_target,
        feature.update_kitchen_target,
        feature.delete_kitchen_target,
      ]),
    );
  },
  Authentication.fnb,
  KitchenTargetController.getDetail,
);

router.post(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.create_kitchen_target]),
    );
  },
  [
    // check('picId', 'picId attribute must be integer').isInt(),
    check('menuId', "menuId attribute can't be empty").isInt(),
    check('kitchenId', "kitchenId attribute can't be empty").isInt(),
    check('date', 'date attribute must use format (YYYY-MM-YY)').isDate(),
    check('quantityTarget', "quantityTarget attribute can't be empty").isInt(),
  ],
  ValidateMiddleware.result,
  Authentication.fnb,
  KitchenTargetController.create,
);

router.put(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.update_kitchen_target]),
    );
  },
  Authentication.fnb,
  KitchenTargetController.update,
);

router.delete(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.delete_kitchen_target]),
    );
  },
  Authentication.fnb,
  KitchenTargetController.delete,
);

module.exports = router;
