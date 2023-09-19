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
        feature.progress_vehicle_schedule,
        feature.absent_vehicle_schedule,
        feature.fulfill_vehicle_schedule,
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
        feature.progress_vehicle_schedule,
        feature.absent_vehicle_schedule,
        feature.fulfill_vehicle_schedule,
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
    check('pickUpId', "Pick Up Id attribute can't be empty").notEmpty(),
    check('destinationId', "Destination Id attribute can't be empty").notEmpty(),
    check('name', "Name attribute can't be empty").notEmpty(),
    check('pickUpTime', "Pick Up Time attribute can't be empty").notEmpty(),
    check('passengers', "Passengers attribute can't be empty").isArray(),
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
    check('pickUpId', "Pick Up Id attribute can't be empty").notEmpty(),
    check('destinationId', "Destination Id attribute can't be empty").notEmpty(),
    check('name', "Name attribute can't be empty").notEmpty(),
    check('pickUpTime', "Pick Up Time attribute can't be empty").notEmpty(),
    check('passengers', "Passengers attribute can't be empty").isArray(),
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
        feature.progress_vehicle_schedule,
      ]),
    );
  },
  VehicleScheduleController.progressStatus,
);

router.put(
  '/:id/fulfill',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.fulfill_vehicle_schedule,
      ]),
    );
  },
  [
    check('driverId', "Driver Id attribute can't be empty").notEmpty(),
    check('vehicleId', "Vehicle Id attribute can't be empty").notEmpty(),
  ],
  ValidateMiddleware.result,
  VehicleScheduleController.fulfill,
);

router.put(
  '/:id/absent',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.absent_vehicle_schedule,
      ]),
    );
  },
  [
    check('participantId', "Participant Id attribute can't be empty").notEmpty(),
    check('statusId', "Status Id attribute can't be empty").notEmpty(),
  ],
  ValidateMiddleware.result,
  VehicleScheduleController.absent,
);

router.get(
  '/:id/passengers',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_vehicle_schedule,
        feature.absent_vehicle_schedule,
      ]),
    );
  },
  VehicleScheduleController.passengers,
);

module.exports = router;
