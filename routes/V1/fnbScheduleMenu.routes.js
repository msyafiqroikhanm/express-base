const router = require('express').Router();
const { check } = require('express-validator');
const features = require('../../helpers/features.helper');
const ValidateMiddleware = require('../../middlewares/validate.middleware');
const Authentication = require('../../middlewares/auth.middleware');
const FNBScheduleMenuController = require('../../controllers/fnbScheduleMenu.controller');

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
        feature.view_fnb_schedule_menu,
        feature.create_fnb_schedule_menu,
        feature.update_fnb_schedule_menu,
        feature.delete_fnb_schedule_menu,
        feature.view_kitchen,
        feature.create_kitchen,
        feature.update_kitchen,
        feature.delete_kitchen,
      ]),
    );
  },
  Authentication.fnb,
  FNBScheduleMenuController.getAll,
);

router.get(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_fnb_schedule_menu,
        feature.update_fnb_schedule_menu,
        feature.delete_fnb_schedule_menu,
        feature.view_fnb_schedule,
        feature.create_fnb_schedule,
        feature.update_fnb_schedule,
        feature.delete_fnb_schedule,
        feature.view_kitchen,
        feature.create_kitchen,
        feature.update_kitchen,
        feature.delete_kitchen,
      ]),
    );
  },
  Authentication.fnb,
  FNBScheduleMenuController.getDetail,
);

router.post(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.create_fnb_schedule_menu,
        feature.update_kitchen,
        feature.create_fnb_schedule,
      ]),
    );
  },
  [
    check('scheduleId', "scheduleId attribute can't be empty").notEmpty(),
    check('kitchenTargetId', "kitchenTargetId attribute can't be empty").notEmpty(),
    check('quantity', "quantity attribute can't be empty").notEmpty(),
  ],
  ValidateMiddleware.result,
  Authentication.fnb,
  FNBScheduleMenuController.create,
);

router.put(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.update_fnb_schedule_menu,
        feature.update_kitchen,
        feature.update_fnb_schedule,
      ]),
    );
  },
  [check('isValid', 'isValid attribute must be boolean').optional().isBoolean()],
  ValidateMiddleware.result,
  Authentication.fnb,
  FNBScheduleMenuController.update,
);

router.delete(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.delete_fnb_schedule_menu,
        feature.update_kitchen,
        feature.delete_fnb_schedule,
      ]),
    );
  },
  Authentication.fnb,
  FNBScheduleMenuController.delete,
);

module.exports = router;
