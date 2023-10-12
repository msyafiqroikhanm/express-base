const router = require('express').Router();
const { check } = require('express-validator');
const features = require('../../helpers/features.helper');
const ValidateMiddleware = require('../../middlewares/validate.middleware');
const Authentication = require('../../middlewares/auth.middleware');
const FNBScheduleController = require('../../controllers/fnbSchedule.controller');

router.patch(
  '/:id/progress-statuses',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.update_fnb_schedule]),
    );
  },
  [check('statusId', "statusId attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  Authentication.fnb,
  FNBScheduleController.updateProgress,
);

router.get(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_fnb_schedule,
        feature.create_fnb_schedule,
        feature.update_fnb_schedule,
        feature.delete_fnb_schedule,
      ]),
    );
  },
  Authentication.fnb,
  FNBScheduleController.getAll,
);

router.get(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_fnb_schedule,
        feature.update_fnb_schedule,
        feature.delete_fnb_schedule,
      ]),
    );
  },
  Authentication.fnb,
  FNBScheduleController.getDetail,
);

router.post(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.create_fnb_schedule]),
    );
  },
  [
    check('locationId', "locationId attribute can't be empty").notEmpty(),
    check('kitchenId', "kitchenId attribute can't be empty").notEmpty(),
    check('courierId', "courierId attribute can't be empty").notEmpty(),
    check('statusId', "statusId attribute can't be empty").notEmpty(),
    check('name', "name attribute can't be empty").notEmpty(),
    // check('pickUpTime', "pickUpTime attribute can't be empty").notEmpty(),
    // check('dropOffTime', "dropOffTime attribute can't be empty").notEmpty(),
    check('vehiclePlatNo', "vehiclePlateNo attribute can't be empty").notEmpty(),
  ],
  ValidateMiddleware.result,
  Authentication.fnb,
  FNBScheduleController.create,
);

router.put(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.update_fnb_schedule]),
    );
  },
  Authentication.fnb,
  FNBScheduleController.update,
);

router.delete(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.delete_fnb_schedule]),
    );
  },
  Authentication.fnb,
  FNBScheduleController.delete,
);

module.exports = router;
