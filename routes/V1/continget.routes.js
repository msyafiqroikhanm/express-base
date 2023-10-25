const router = require('express').Router();
const { check } = require('express-validator');
const features = require('../../helpers/features.helper');
const ContingentController = require('../../controllers/continget.controller');
const ValidateMiddleware = require('../../middlewares/validate.middleware');
const Authentication = require('../../middlewares/auth.middleware');

router.get(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_contingent,
        feature.create_contingent,
        feature.update_contingent,
        feature.delete_contingent,
        feature.create_group,
        feature.update_group,
        feature.create_participant,
        feature.update_participant,
        feature.view_vehicle_schedule,
        feature.create_vehicle_schedule,
        feature.update_vehicle_schedule,
        feature.delete_vehicle_schedule,
        feature.progress_vehicle_schedule,
        feature.absent_vehicle_schedule,
        feature.fulfill_vehicle_schedule,
        feature.view_lodger,
        feature.create_lodger,
        feature.update_lodger,
        feature.view_location,
        feature.create_location,
        feature.update_location,
      ]),
    );
  },
  Authentication.participant,
  ContingentController.getAll,
);

router.get(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_contingent,
        feature.update_contingent,
        feature.delete_contingent,
        feature.create_group,
        feature.update_group,
        feature.create_participant,
        feature.update_participant,
        feature.view_vehicle_schedule,
        feature.create_vehicle_schedule,
        feature.update_vehicle_schedule,
        feature.delete_vehicle_schedule,
        feature.progress_vehicle_schedule,
        feature.absent_vehicle_schedule,
        feature.fulfill_vehicle_schedule,
        feature.view_lodger,
        feature.create_lodger,
        feature.update_lodger,
        feature.view_location,
        feature.create_location,
        feature.update_location,
      ]),
    );
  },
  Authentication.participant,
  ContingentController.getDetail,
);

router.post(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.create_contingent]),
    );
  },
  [
    check('regionId', "Region Id attribute can't be empty").notEmpty(),
    check('name', "Name attribute can't be empty").notEmpty(),
  ],
  ValidateMiddleware.result,
  ContingentController.create,
);

router.put(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.update_contingent]),
    );
  },
  [
    check('regionId', "Region Id attribute can't be empty").notEmpty(),
    check('name', "Name attribute can't be empty").notEmpty(),
  ],
  ValidateMiddleware.result,
  ContingentController.update,
);

router.delete(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.delete_contingent]),
    );
  },
  ContingentController.delete,
);

module.exports = router;
