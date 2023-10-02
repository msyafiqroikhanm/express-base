const router = require('express').Router();
const { check } = require('express-validator');
const features = require('../../helpers/features.helper');
const EventController = require('../../controllers/event.controller');
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
        feature.view_event,
        feature.create_event,
        feature.update_event,
        feature.delete_event,
        feature.create_group,
        feature.update_group,
      ]),
    );
  },
  Authentication.event,
  EventController.getAll,
);

router.post(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.create_event,
      ]),
    );
  },
  Authentication.event,
  [
    check('picId', 'Pic Id attribute can\'t be empty').notEmpty(),
    check('categoryId', 'Category Id attribute can\'t be empty').notEmpty(),
    check('locationId', 'Location Id attribute can\'t be empty').notEmpty(),
    check('name', 'Name attribute can\'t be empty').notEmpty(),
    // check('code', 'Code attribute can\'t be empty').notEmpty(),
    // check('minAge', 'Minimum Age Must Be Greater Than 0').optional().isInt({ gt: 0 }),
    // check('maxAge', 'Maximum Age Must Be Greater Than 0').optional().isInt({ gt: 0 }),
    // check('maxParticipantPerGroup', 'Maximum Participant Per Group Must Be Greater Than 0').optional().isInt({ gt: 0 }),
    // check('maxTotalParticipant', 'Maximum Total Participant Must Be Greater Than 0').optional().isInt({ gt: 0 }),
    check('schedules', 'Schedules attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  EventController.create,
);

router.get(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_event,
        feature.update_event,
        feature.delete_event,
        feature.create_group,
        feature.update_group,
      ]),
    );
  },
  Authentication.event,
  EventController.getDetail,
);

router.put(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.update_event,
      ]),
    );
  },
  Authentication.event,
  [
    check('picId', 'Pic Id attribute can\'t be empty').notEmpty(),
    check('categoryId', 'Category Id attribute can\'t be empty').notEmpty(),
    check('locationId', 'Location Id attribute can\'t be empty').notEmpty(),
    check('name', 'Name attribute can\'t be empty').notEmpty(),
    // check('code', 'Code attribute can\'t be empty').notEmpty(),
    // check('minAge', 'Minimum Age Must Be Greater Than 0').optional().isInt({ gt: 0 }),
    // check('maxAge', 'Maximum Age Must Be Greater Than 0').optional().isInt({ gt: 0 }),
    // check('maxParticipantPerGroup', 'Maximum Participant Per Group Must Be Greater Than 0').optional().isInt({ gt: 0 }),
    // check('maxTotalParticipant', 'Maximum Total Participant Must Be Greater Than 0').optional().isInt({ gt: 0 }),
    check('schedules', 'Schedules attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  EventController.update,
);

router.delete(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.delete_event,
      ]),
    );
  },
  Authentication.event,
  EventController.delete,
);

router.get(
  '/:id/groups',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_event,
        feature.create_event,
        feature.update_event,
        feature.delete_event,
      ]),
    );
  },
  Authentication.event,
  EventController.getGroup,
);

router.put(
  '/:id/group-progress',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_event,
        feature.create_event,
        feature.update_event,
        feature.delete_event,
      ]),
    );
  },
  Authentication.event,
  [
    check('groupId', 'Group Id attribute can\'t be empty').notEmpty(),
    check('statusId', 'Status Id attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  EventController.progressGroup,
);

module.exports = router;
