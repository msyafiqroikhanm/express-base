const router = require('express').Router();
const { check } = require('express-validator');
const features = require('../../helpers/features.helper');
const ValidateMiddleware = require('../../middlewares/validate.middleware');
const Authentication = require('../../middlewares/auth.middleware');
const DriverController = require('../../controllers/driver.controller');

router.get(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_driver,
        feature.create_driver,
        feature.update_driver,
        feature.delete_driver,
      ]),
    );
  },
  DriverController.getAll,
);

router.get(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_driver,
        feature.update_driver,
        feature.delete_driver,
      ]),
    );
  },
  DriverController.getDetail,
);

router.post(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.create_driver,
      ]),
    );
  },
  [
    check('vendorId', "Vendor Id attribute can't be empty").notEmpty(),
    check('name', "Name attribute can't be empty").notEmpty(),
    check('phoneNbr', "Phone Number attribute can't be empty").isMobilePhone('id-ID'),
    check('email', "Email attribute can't be empty").isEmail(),
  ],
  ValidateMiddleware.result,
  DriverController.create,
);

router.put(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.update_driver,
      ]),
    );
  },
  [
    check('vendorId', "Vendor Id attribute can't be empty").notEmpty(),
    check('name', "Name attribute can't be empty").notEmpty(),
    check('phoneNbr', "Phone Number attribute can't be empty").isMobilePhone('id-ID'),
    check('email', "Email attribute can't be empty").isEmail(),
  ],
  ValidateMiddleware.result,
  DriverController.update,
);

router.delete(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.delete_driver,
      ]),
    );
  },
  DriverController.delete,
);

module.exports = router;
