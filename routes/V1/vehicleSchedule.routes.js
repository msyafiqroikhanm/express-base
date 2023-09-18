const router = require('express').Router();
const { check } = require('express-validator');
const features = require('../../helpers/features.helper');
const ValidateMiddleware = require('../../middlewares/validate.middleware');
const Authentication = require('../../middlewares/auth.middleware');
const VehicleScheduleController = require('../../controllers/vehicleSchedule.controller');

router.get(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_vehicle_schedule,
        feature.create_vehicle_schedule,
        feature.update_vehicle_schedule,
        feature.delete_vehicle_schedule,
      ]),
    );
  },
  VehicleScheduleController.getAll,
);

router.get(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_vehicle_schedule,
        feature.update_vehicle_schedule,
        feature.delete_vehicle_schedule,
      ]),
    );
  },
  VehicleScheduleController.getDetail,
);

router.post(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.create_vehicle_schedule,
      ]),
    );
  },
  [
    check('vehicleId', "Vehicle Id attribute can't be empty").notEmpty(),
    check('driverId', "Driver Id attribute can't be empty").notEmpty(),
    check('pickUpId', "Pick Up Id attribute can't be empty").notEmpty(),
    check('destinationId', "Destination Id attribute can't be empty").notEmpty(),
    check('name', "Name attribute can't be empty").notEmpty(),
    check('pickUpTime', "Pick Up Time attribute can't be empty").notEmpty(),
  ],
  ValidateMiddleware.result,
  VehicleScheduleController.create,
);

router.put(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.update_vehicle_schedule,
      ]),
    );
  },
  [
    check('vehicleId', "Vehicle Id attribute can't be empty").notEmpty(),
    check('driverId', "Driver Id attribute can't be empty").notEmpty(),
    check('pickUpId', "Pick Up Id attribute can't be empty").notEmpty(),
    check('destinationId', "Destination Id attribute can't be empty").notEmpty(),
    check('name', "Name attribute can't be empty").notEmpty(),
    check('pickUpTime', "Pick Up Time attribute can't be empty").notEmpty(),
  ],
  ValidateMiddleware.result,
  VehicleScheduleController.update,
);

router.delete(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.delete_vehicle_schedule,
      ]),
    );
  },
  VehicleScheduleController.delete,
);

router.patch(
  '/:id/progress',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.update_vehicle_schedule,
      ]),
    );
  },
  VehicleScheduleController.progressStatus,
);

module.exports = router;
