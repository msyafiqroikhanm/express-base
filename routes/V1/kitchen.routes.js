const router = require('express').Router();
const { check } = require('express-validator');
const features = require('../../helpers/features.helper');
const Authentication = require('../../middlewares/auth.middleware');
const ValidateMiddleware = require('../../middlewares/validate.middleware');
const KitchenController = require('../../controllers/kitchen.controller');

router.get(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_kitchen,
        feature.create_kitchen,
        feature.update_kitchen,
        feature.delete_kitchen,
      ]),
    );
  },
  Authentication.fnb,
  KitchenController.getAll,
);

router.get(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_kitchen,
        feature.create_kitchen,
        feature.update_kitchen,
        feature.delete_kitchen,
      ]),
    );
  },
  Authentication.fnb,
  KitchenController.getDetail,
);

router.post(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.create_kitchen]),
    );
  },
  [
    // check('picId', 'picId attribute must be integer').isInt(),
    check('name', "name attribute can't be empty").notEmpty(),
    check('phoneNbr', "phoneNbr attribute can't be empty").notEmpty(),
    check('address', "address attribute can't be empty").notEmpty(),
    check('latitude', "latitude attribute can't be empty").notEmpty(),
    check('longtitude', "longtitude attribute can't be empty").notEmpty(),
  ],
  ValidateMiddleware.result,
  Authentication.fnb,
  KitchenController.create,
);

router.put(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.update_kitchen]),
    );
  },
  Authentication.fnb,
  KitchenController.update,
);

router.delete(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.delete_kitchen]),
    );
  },
  Authentication.fnb,
  KitchenController.delete,
);
module.exports = router;
