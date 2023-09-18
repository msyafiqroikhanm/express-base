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
        feature.create_vehicle_schedule,
        feature.update_vehicle_schedule,
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
        feature.create_vehicle_schedule,
        feature.update_vehicle_schedule,
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

router.get(
  '/:id/schedules',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_vehicle,
      ]),
    );
  },
  VehicleController.getSchedule,
);

router.get(
  '/:id/track',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_vehicle,
      ]),
    );
  },
  VehicleController.getTrack,
);

router.post(
  '/:id/track',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_vehicle,
        feature.create_vehicle,
      ]),
    );
  },
  [
    check('latitude', "Latitude attribute can't be empty").notEmpty(),
    check('longtitude', "Longtitude attribute can't be empty").notEmpty(),
    check('accuracy', "Accuracy attribute can't be empty").notEmpty(),
  ],
  ValidateMiddleware.result,
  VehicleController.track,
);

module.exports = router;
