const router = require('express').Router();
const { check } = require('express-validator');
const features = require('../../helpers/features.helper');
const GroupController = require('../../controllers/group.controller');
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
        feature.view_group,
        feature.create_group,
        feature.update_group,
        feature.delete_group,
      ]),
    );
  },
  GroupController.getAll,
);

router.get(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_group,
        feature.update_group,
        feature.delete_group,
      ]),
    );
  },
  GroupController.getDetail,
);

router.post(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.create_group,
      ]),
    );
  },
  [
    check('eventId', 'Event Id attribute can\'t be empty').notEmpty(),
    check('contingentId', 'Contingent Id attribute can\'t be empty').notEmpty(),
    check('statusId', 'Status Id attribute can\'t be empty').notEmpty(),
    check('name', 'Name attribute can\'t be empty').notEmpty(),
    check('participants', 'Participants attribute can\'t be empty').isArray(),
  ],
  ValidateMiddleware.result,
  GroupController.create,
);

router.put(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.update_group,
      ]),
    );
  },
  [
    check('eventId', 'Event Id attribute can\'t be empty').notEmpty(),
    check('contingentId', 'Contingent Id attribute can\'t be empty').notEmpty(),
    check('statusId', 'Status Id attribute can\'t be empty').notEmpty(),
    check('name', 'Name attribute can\'t be empty').notEmpty(),
    check('participants', 'Participants attribute can\'t be empty').isArray(),
  ],
  ValidateMiddleware.result,
  GroupController.update,
);

router.delete(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.delete_group,
      ]),
    );
  },
  GroupController.delete,
);

module.exports = router;
