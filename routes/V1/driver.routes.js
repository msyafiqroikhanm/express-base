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
        feature.view_vehicle_schedule,
        feature.create_vehicle_schedule,
        feature.update_vehicle_schedule,
      ]),
    );
  },
  Authentication.transportation,
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
        feature.view_vehicle_schedule,
        feature.create_vehicle_schedule,
        feature.update_vehicle_schedule,
      ]),
    );
  },
  Authentication.transportation,
  DriverController.getDetail,
);

router.post(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.create_driver]),
    );
  },
  Authentication.transportation,
  [
    check('identityTypeId', "Identity type Id attribute can't be empty").notEmpty(),
    check('gender', "Gender attribute can't be empty").notEmpty(),
    check('birthDate', "Birth Date attribute can't be empty").isDate(),
    check('identityNo', "Identity Number attribute can't be empty").notEmpty(),
    // check('address', "Address attribute can't be empty").notEmpty(),
    check('username', "Username attribute can't be empty").notEmpty(),
    check('password', "Password attribute can't be empty").notEmpty(),
    check('vendorId', "Vendor Id attribute can't be empty").notEmpty(),
    check('name', "Name attribute can't be empty").notEmpty(),
    check('phoneNbr', "Phone Number attribute can't be empty").notEmpty(),
    // check('email', "Email attribute can't be empty").isEmail(),
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
      await features().then((feature) => [feature.update_driver]),
    );
  },
  Authentication.transportation,
  [
    check('vendorId', "Vendor Id attribute can't be empty").notEmpty(),
    check('name', "Name attribute can't be empty").notEmpty(),
    check('phoneNbr', "Phone Number attribute can't be empty").notEmpty(),
    // check('email', "Email attribute can't be empty").isEmail(),
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
      await features().then((feature) => [feature.delete_driver]),
    );
  },
  Authentication.transportation,
  DriverController.delete,
);

module.exports = router;
