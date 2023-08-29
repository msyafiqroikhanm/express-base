const router = require('express').Router();
const { check } = require('express-validator');
const features = require('../../helpers/features.helper');
const { SysConfigCategory, QrType, EventCategory } = require('../../controllers/reference.controller');
const ValidateMiddleware = require('../../middlewares/validate.middleware');
const Authentication = require('../../middlewares/auth.middleware');

router.get(
  '/config-categories',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_configuration_category,
        feature.create_configuration_category,
        feature.update_configuration_category,
        feature.delete_configuration_category,
      ]),
    );
  },
  SysConfigCategory.getAll,
);

router.post(
  '/config-categories/add',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.create_configuration_category,
      ]),
    );
  },
  [
    check('name', 'Name attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  SysConfigCategory.create,
);

router.put(
  '/config-categories/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.update_configuration_category,
      ]),
    );
  },
  [
    check('name', 'Name attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  SysConfigCategory.update,
);

router.delete(
  '/config-categories/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.delete_configuration_category,
      ]),
    );
  },
  SysConfigCategory.delete,
);

router.get(
  '/config-categories/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_configuration_category,
        feature.update_configuration_category,
        feature.delete_configuration_category,
      ]),
    );
  },
  SysConfigCategory.getDetail,
);

router.get(
  '/qr-types',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_qr_type,
        feature.create_qr_type,
        feature.update_qr_type,
        feature.delete_qr_type,
      ]),
    );
  },
  QrType.getAll,
);

router.post(
  '/qr-types',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.create_qr_type,
      ]),
    );
  },
  [
    check('name', 'Name attribute can\'t be empty').notEmpty(),
    check('label', 'Label attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  QrType.create,
);

router.put(
  '/qr-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.update_qr_type,
      ]),
    );
  },
  [
    check('name', 'Name attribute can\'t be empty').notEmpty(),
    check('label', 'Label attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  QrType.update,
);

router.delete(
  '/qr-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.delete_qr_type,
      ]),
    );
  },
  QrType.delete,
);

router.get(
  '/qr-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_qr_type,
        feature.update_qr_type,
        feature.delete_qr_type,
      ]),
    );
  },
  QrType.getDetail,
);

router.get(
  '/event-categories',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_event_category,
        feature.create_event_category,
        feature.update_event_category,
        feature.delete_event_category,
      ]),
    );
  },
  EventCategory.getAll,
);

router.post(
  '/event-categories',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.create_event_category,
      ]),
    );
  },
  [
    check('name', 'Name attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  EventCategory.create,
);

router.get(
  '/event-categories/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_event_category,
        feature.update_event_category,
        feature.delete_event_category,
      ]),
    );
  },
  EventCategory.getDetail,
);

router.put(
  '/event-categories/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.update_event_category,
      ]),
    );
  },
  [
    check('name', 'Name attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  EventCategory.update,
);

router.delete(
  '/event-categories/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.delete_event_category,
      ]),
    );
  },
  EventCategory.delete,
);

module.exports = router;
