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
  VehicleScheduleController.create,
);

router.get(
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

module.exports = router;
