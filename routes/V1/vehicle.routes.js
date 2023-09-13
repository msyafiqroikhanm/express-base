const router = require('express').Router();
const { check } = require('express-validator');
const features = require('../../helpers/features.helper');
const ValidateMiddleware = require('../../middlewares/validate.middleware');
const Authentication = require('../../middlewares/auth.middleware');
const VehicleController = require('../../controllers/vehicle.controller');

router.get(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_vehicle,
        feature.create_vehicle,
        feature.update_vehicle,
        feature.delete_vehicle,
      ]),
    );
  },
  VehicleController.getAll,
);

router.get(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_vehicle,
        feature.update_vehicle,
        feature.delete_vehicle,
      ]),
    );
  },
  VehicleController.getDetail,
);

router.post(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.create_vehicle,
      ]),
    );
  },
  [
    check('vendorId', "Vendor Id attribute can't be empty").notEmpty(),
    check('typeId', "Type Id attribute can't be empty").notEmpty(),
    check('vehicleNo', "Vehicle No attribute can't be empty").notEmpty(),
    check('vehiclePlateNo', "Vehicle Plate No attribute can't be empty").notEmpty(),
    check('name', "Name attribute can't be empty").notEmpty(),
    check('capacity', "Capacity attribute can't be empty").isInt({ gt: 0 }),
  ],
  ValidateMiddleware.result,
  VehicleController.create,
);

router.put(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.update_vehicle,
      ]),
    );
  },
  [
    check('vendorId', "Vendor Id attribute can't be empty").notEmpty(),
    check('typeId', "Type Id attribute can't be empty").notEmpty(),
    check('vehicleNo', "Vehicle No attribute can't be empty").notEmpty(),
    check('vehiclePlateNo', "Vehicle Plate No attribute can't be empty").notEmpty(),
    check('name', "Name attribute can't be empty").notEmpty(),
    check('capacity', "Capacity attribute can't be empty").isInt({ gt: 0 }),
  ],
  ValidateMiddleware.result,
  VehicleController.update,
);

router.delete(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.delete_vehicle,
      ]),
    );
  },
  VehicleController.delete,
);

module.exports = router;
