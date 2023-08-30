const router = require('express').Router();
const { check } = require('express-validator');
const features = require('../../helpers/features.helper');
const {
  SysConfigCategory, QrType, EventCategory, Region, GroupStatus, ParticipantType, IdentityType,
} = require('../../controllers/reference.controller');
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

router.get(
  '/regions',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_region,
        feature.create_region,
        feature.update_region,
        feature.delete_region,
        feature.create_contingent,
        feature.update_contingent,
      ]),
    );
  },
  Region.getAll,
);

router.get(
  '/regions/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_region,
        feature.update_region,
        feature.delete_region,
      ]),
    );
  },
  Region.getDetail,
);

router.post(
  '/regions',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.create_region,
      ]),
    );
  },
  [
    check('name', 'Name attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  Region.create,
);

router.put(
  '/regions/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.update_region,
      ]),
    );
  },
  [
    check('name', 'Name attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  Region.update,
);

router.delete(
  '/regions/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.delete_region,
      ]),
    );
  },
  Region.delete,
);

router.get(
  '/group-statuses',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_group_status,
        feature.create_group_status,
        feature.update_group_status,
        feature.delete_group_status,
        feature.create_group,
        feature.update_group,
      ]),
    );
  },
  GroupStatus.getAll,
);

router.get(
  '/group-statuses/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_group_status,
        feature.update_group_status,
        feature.delete_group_status,
      ]),
    );
  },
  GroupStatus.getDetail,
);

router.post(
  '/group-statuses',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.create_group_status,
      ]),
    );
  },
  [
    check('name', 'Name attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  GroupStatus.create,
);

router.put(
  '/group-statuses/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.update_group_status,
      ]),
    );
  },
  [
    check('name', 'Name attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  GroupStatus.update,
);

router.delete(
  '/group-statuses/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.delete_group_status,
      ]),
    );
  },
  GroupStatus.delete,
);

router.get(
  '/participant-types',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_participant_type,
        feature.create_participant_type,
        feature.update_participant_type,
        feature.delete_participant_type,
      ]),
    );
  },
  ParticipantType.getAll,
);

router.get(
  '/participant-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_participant_type,
        feature.update_participant_type,
        feature.delete_participant_type,
      ]),
    );
  },
  ParticipantType.getDetail,
);

router.post(
  '/participant-types',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.create_participant_type,
      ]),
    );
  },
  [
    check('name', 'Name attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  ParticipantType.create,
);

router.put(
  '/participant-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.update_participant_type,
      ]),
    );
  },
  [
    check('name', 'Name attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  ParticipantType.update,
);

router.delete(
  '/participant-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.delete_participant_type,
      ]),
    );
  },
  ParticipantType.delete,
);

router.get(
  '/identity-types',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_identity_type,
        feature.create_identity_type,
        feature.update_identity_type,
        feature.delete_identity_type,
      ]),
    );
  },
  IdentityType.getAll,
);

router.get(
  '/identity-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_identity_type,
        feature.update_identity_type,
        feature.delete_identity_type,
      ]),
    );
  },
  IdentityType.getDetail,
);

router.post(
  '/identity-types',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.create_identity_type,
      ]),
    );
  },
  [
    check('name', 'Name attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  IdentityType.create,
);

router.put(
  '/identity-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.update_identity_type,
      ]),
    );
  },
  [
    check('name', 'Name attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  IdentityType.update,
);

router.delete(
  '/identity-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.delete_identity_type,
      ]),
    );
  },
  IdentityType.delete,
);

module.exports = router;
