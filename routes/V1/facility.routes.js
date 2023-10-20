const router = require('express').Router();
const { check } = require('express-validator');
const features = require('../../helpers/features.helper');
const ValidateMiddleware = require('../../middlewares/validate.middleware');
const Authentication = require('../../middlewares/auth.middleware');
const FacilityController = require('../../controllers/facility.controller');

router.post(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.create_facility]),
    );
  },
  [
    check('locationId', 'locationId attribute must be integer').isInt(),
    check('name', 'name attribute cant be empty').notEmpty(),
    check('quantity', 'quantity attribute cant be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  Authentication.accomodation,
  FacilityController.create,
);

router.get(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_facility,
        feature.create_facility,
        feature.update_facility,
        feature.delete_facility,
        feature.view_location,
        feature.create_location,
        feature.update_location,
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
  Authentication.accomodation,
  FacilityController.getAll,
);

router.get(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_facility,
        feature.create_facility,
        feature.update_facility,
        feature.delete_facility,
        feature.view_location,
        feature.create_location,
        feature.update_location,
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
  Authentication.accomodation,
  FacilityController.getDetail,
);

router.put(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.update_facility]),
    );
  },
  Authentication.accomodation,
  FacilityController.update,
);

router.delete(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.delete_facility]),
    );
  },
  Authentication.accomodation,
  FacilityController.delete,
);

module.exports = router;
