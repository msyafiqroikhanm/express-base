const router = require('express').Router();
const { check } = require('express-validator');
const features = require('../../helpers/features.helper');
const {
  SysConfigCategory,
  QrType,
  EventCategory,
  Region,
  GroupStatus,
  ParticipantType,
  IdentityType,
  LocationType,
  ChatbotResponseType,
  FeedbackType,
  FeedbackTarget,
  FeedbackStatus,
  FAQType,
  TemplateCategory,
  MetaTemplateCategory,
  TemplateHeaderType,
  RoomType,
  RoomStatus,
  LodgerStatus,
  PICType,
  MetaLanguage,
  PassengerStatus,
  MenuType,
  FoodType,
  VehicleScheduleStatus,
  VehicleType,
  CommitteeType,
} = require('../../controllers/reference.controller');
const ValidateMiddleware = require('../../middlewares/validate.middleware');
const Authentication = require('../../middlewares/auth.middleware');
const { FoodScheduleStatus } = require('../../controllers/reference.controller');
const LocationController = require('../../controllers/location.controller');

// * Configuration Category

router.get(
  '/config-categories',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_system_configuration_category,
        feature.create_system_configuration_category,
        feature.update_system_configuration_category,
        feature.delete_system_configuration_category,
        feature.create_system_configuration,
        feature.update_system_configuration,
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
      await features().then((feature) => [feature.create_system_configuration_category]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
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
      await features().then((feature) => [feature.update_system_configuration_category]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
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
      await features().then((feature) => [feature.delete_system_configuration_category]),
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
        feature.view_system_configuration_category,
        feature.update_system_configuration_category,
        feature.delete_system_configuration_category,
        feature.create_system_configuration,
        feature.update_system_configuration,
      ]),
    );
  },
  SysConfigCategory.getDetail,
);

// * QR Type

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
        feature.create_qr_template,
        feature.update_qr_template,
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
      await features().then((feature) => [feature.create_qr_type]),
    );
  },
  [
    check('name', "Name attribute can't be empty").notEmpty(),
    check('label', "Label attribute can't be empty").notEmpty(),
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
      await features().then((feature) => [feature.update_qr_type]),
    );
  },
  [
    check('name', "Name attribute can't be empty").notEmpty(),
    check('label', "Label attribute can't be empty").notEmpty(),
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
      await features().then((feature) => [feature.delete_qr_type]),
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
        feature.create_qr_template,
        feature.update_qr_template,
      ]),
    );
  },
  QrType.getDetail,
);

// * Event Categories

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
        feature.create_event,
        feature.update_event,
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
      await features().then((feature) => [feature.create_event_category]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
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
        feature.create_event,
        feature.update_event,
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
      await features().then((feature) => [feature.update_event_category]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
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
      await features().then((feature) => [feature.delete_event_category]),
    );
  },
  EventCategory.delete,
);

// * Regions

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
        feature.create_contingent,
        feature.update_contingent,
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
      await features().then((feature) => [feature.create_region]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
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
      await features().then((feature) => [feature.update_region]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
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
      await features().then((feature) => [feature.delete_region]),
    );
  },
  Region.delete,
);

// * Group Status

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
        feature.progress_group,
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
        feature.create_group,
        feature.update_group,
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
      await features().then((feature) => [feature.create_group_status]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
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
      await features().then((feature) => [feature.update_group_status]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
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
      await features().then((feature) => [feature.delete_group_status]),
    );
  },
  GroupStatus.delete,
);

// * Participant Type

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
        feature.create_participant,
        feature.update_participant,
        feature.create_information_center,
        feature.update_information_center,
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
        feature.create_participant,
        feature.update_participant,
        feature.create_information_center,
        feature.update_information_center,
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
      await features().then((feature) => [feature.create_participant_type]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
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
      await features().then((feature) => [feature.update_participant_type]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
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
      await features().then((feature) => [feature.delete_participant_type]),
    );
  },
  ParticipantType.delete,
);

// * Participant Identity Type

router.get(
  '/identity-types',
  IdentityType.getAll,
);

router.get(
  '/identity-types/:id',
  IdentityType.getDetail,
);

router.post(
  '/identity-types',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.create_identity_type]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
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
      await features().then((feature) => [feature.update_identity_type]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
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
      await features().then((feature) => [feature.delete_identity_type]),
    );
  },
  IdentityType.delete,
);

//* Location Types
router.post(
  '/location-types',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.create_location_type]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  LocationType.create,
);
router.get(
  '/location-types',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_location_type,
        feature.create_location_type,
        feature.update_location_type,
        feature.delete_location_type,
      ]),
    );
  },
  LocationType.getAll,
);

router.get(
  '/location-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_location_type,
        feature.create_location_type,
        feature.update_location_type,
        feature.delete_location_type,
      ]),
    );
  },
  LocationType.getDetail,
);

router.put(
  '/location-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_location_type,
        feature.create_location_type,
        feature.update_location_type,
        feature.delete_location_type,
      ]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  LocationType.update,
);

router.delete(
  '/location-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.delete_location_type]),
    );
  },
  LocationType.delete,
);

//! Room Types
router.post(
  '/room-types',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.create_room_type]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  Authentication.accomodation,
  RoomType.create,
);
router.get(
  '/room-types',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_room_type,
        feature.create_room_type,
        feature.update_room_type,
        feature.delete_room_type,
      ]),
    );
  },
  Authentication.accomodation,
  RoomType.getAll,
);
router.get(
  '/room-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_room_type,
        feature.create_room_type,
        feature.update_room_type,
        feature.delete_room_type,
      ]),
    );
  },
  Authentication.accomodation,
  RoomType.getDetail,
);
router.put(
  '/room-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_room_type,
        feature.create_room_type,
        feature.update_room_type,
        feature.delete_room_type,
      ]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  Authentication.accomodation,
  RoomType.update,
);
router.delete(
  '/room-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.delete_room_type]),
    );
  },
  Authentication.accomodation,
  RoomType.delete,
);

//* Room Statuses
router.post(
  '/room-statuses',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.create_room_status]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  RoomStatus.create,
);
router.get(
  '/room-statuses',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_room_status,
        feature.create_room_status,
        feature.update_room_status,
        feature.delete_room_status,
      ]),
    );
  },
  RoomStatus.getAll,
);
router.get(
  '/room-statuses/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_room_status,
        feature.create_room_status,
        feature.update_room_status,
        feature.delete_room_status,
      ]),
    );
  },
  RoomStatus.getDetail,
);
router.put(
  '/room-statuses/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_room_status,
        feature.create_room_status,
        feature.update_room_status,
        feature.delete_room_status,
      ]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  RoomStatus.update,
);
router.delete(
  '/room-statuses/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.delete_room_status]),
    );
  },
  RoomStatus.delete,
);

//* Lodger Statuses
router.post(
  '/lodger-statuses',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.create_lodger_status]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  LodgerStatus.create,
);
router.get(
  '/lodger-statuses',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_lodger_status,
        feature.create_lodger_status,
        feature.update_lodger_status,
        feature.delete_lodger_status,
        feature.view_lodger,
        feature.create_lodger,
        feature.update_lodger,
        feature.delete_lodger,
      ]),
    );
  },
  LodgerStatus.getAll,
);
router.get(
  '/lodger-statuses/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_lodger_status,
        feature.create_lodger_status,
        feature.update_lodger_status,
        feature.delete_lodger_status,
        feature.view_lodger,
        feature.create_lodger,
        feature.update_lodger,
        feature.delete_lodger,
      ]),
    );
  },
  LodgerStatus.getDetail,
);
router.put(
  '/lodger-statuses/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_lodger_status,
        feature.create_lodger_status,
        feature.update_lodger_status,
        feature.delete_lodger_status,
      ]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  LodgerStatus.update,
);
router.delete(
  '/lodger-statuses/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.delete_lodger_status]),
    );
  },
  LodgerStatus.delete,
);

//* PIC Types
router.post(
  '/pic-types',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.create_pic_type]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  PICType.create,
);
router.get(
  '/pic-types',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_pic,
        feature.create_pic,
        feature.update_pic,
        feature.delete_pic,
        feature.view_pic_type,
        feature.create_pic_type,
        feature.update_pic_type,
        feature.delete_pic_type,
      ]),
    );
  },
  PICType.getAll,
);
router.get(
  '/pic-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_pic,
        feature.create_pic,
        feature.update_pic,
        feature.delete_pic,
        feature.view_pic_type,
        feature.create_pic_type,
        feature.update_pic_type,
        feature.delete_pic_type,
      ]),
    );
  },
  PICType.getDetail,
);
router.put(
  '/pic-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_pic_type,
        feature.create_pic_type,
        feature.update_pic_type,
        feature.delete_pic_type,
      ]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  PICType.update,
);
router.delete(
  '/pic-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.delete_pic_type]),
    );
  },
  PICType.delete,
);

//* Chatbot Response Type

router.get(
  '/chatbot-response-types',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_chatbot_response_type,
        feature.create_chatbot_response_type,
        feature.update_chatbot_response_type,
        feature.delete_chatbot_response_type,
        feature.create_chatbot_response,
        feature.update_chatbot_response,
      ]),
    );
  },
  ChatbotResponseType.getAll,
);

router.get(
  '/chatbot-response-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_chatbot_response_type,
        feature.update_chatbot_response_type,
        feature.delete_chatbot_response_type,
        feature.create_chatbot_response,
        feature.update_chatbot_response,
      ]),
    );
  },
  ChatbotResponseType.getDetail,
);

router.post(
  '/chatbot-response-types',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.create_chatbot_response_type]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  ChatbotResponseType.create,
);

router.put(
  '/chatbot-response-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.update_chatbot_response_type]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  ChatbotResponseType.update,
);

router.delete(
  '/chatbot-response-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.delete_chatbot_response_type]),
    );
  },
  ChatbotResponseType.delete,
);

//* Feedback Type

router.get(
  '/feedback-types',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_feedback_type,
        feature.create_feedback_type,
        feature.update_feedback_type,
        feature.delete_feedback_type,
        feature.create_feedback,
        feature.update_feedback,
      ]),
    );
  },
  FeedbackType.getAll,
);

router.get(
  '/feedback-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_feedback_type,
        feature.update_feedback_type,
        feature.delete_feedback_type,
        feature.create_feedback,
        feature.update_feedback,
      ]),
    );
  },
  FeedbackType.getDetail,
);

router.post(
  '/feedback-types',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.create_feedback_type]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  FeedbackType.create,
);

router.put(
  '/feedback-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.update_feedback_type]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  FeedbackType.update,
);

router.delete(
  '/feedback-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.delete_feedback_type]),
    );
  },
  FeedbackType.delete,
);

//* Feedback Target

router.get(
  '/feedback-targets',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_feedback_target,
        feature.create_feedback_target,
        feature.update_feedback_target,
        feature.delete_feedback_target,
        feature.create_feedback,
        feature.update_feedback,
      ]),
    );
  },
  FeedbackTarget.getAll,
);

router.get(
  '/feedback-targets/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_feedback_target,
        feature.update_feedback_target,
        feature.delete_feedback_target,
        feature.create_feedback,
        feature.update_feedback,
      ]),
    );
  },
  FeedbackTarget.getDetail,
);

router.post(
  '/feedback-targets',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.create_feedback_target]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  FeedbackTarget.create,
);

router.put(
  '/feedback-targets/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.update_feedback_target]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  FeedbackTarget.update,
);

router.delete(
  '/feedback-targets/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.delete_feedback_target]),
    );
  },
  FeedbackTarget.delete,
);

//* Feedback Status

router.get(
  '/feedback-statuses',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_feedback_status,
        feature.create_feedback_status,
        feature.update_feedback_status,
        feature.delete_feedback_status,
        feature.create_feedback,
        feature.update_feedback,
      ]),
    );
  },
  FeedbackStatus.getAll,
);

router.get(
  '/feedback-statuses/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_feedback_status,
        feature.update_feedback_status,
        feature.delete_feedback_status,
        feature.create_feedback,
        feature.update_feedback,
      ]),
    );
  },
  FeedbackStatus.getDetail,
);

router.post(
  '/feedback-statuses',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.create_feedback_status]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  FeedbackStatus.create,
);

router.put(
  '/feedback-statuses/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.update_feedback_status]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  FeedbackStatus.update,
);

router.delete(
  '/feedback-statuses/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.delete_feedback_status]),
    );
  },
  FeedbackStatus.delete,
);

//* FAQ Type

router.get(
  '/faq-types',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_faq_type,
        feature.create_faq_type,
        feature.update_faq_type,
        feature.delete_faq_type,
        feature.create_faq,
        feature.update_faq,
      ]),
    );
  },
  FAQType.getAll,
);

router.get(
  '/faq-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_faq_type,
        feature.update_faq_type,
        feature.delete_faq_type,
        feature.create_faq,
        feature.update_faq,
      ]),
    );
  },
  FAQType.getDetail,
);

router.post(
  '/faq-types',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.create_faq_type]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  FAQType.create,
);

router.put(
  '/faq-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.update_faq_type]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  FAQType.update,
);

router.delete(
  '/faq-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.delete_faq_type]),
    );
  },
  FAQType.delete,
);

//* Broadcast Template Category

router.get(
  '/broadcast-template-categories',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_broadcast_template_category,
        feature.create_broadcast_template_category,
        feature.update_broadcast_template_category,
        feature.delete_broadcast_template_category,
        feature.create_broadcast_template,
        feature.update_broadcast_template,
      ]),
    );
  },
  TemplateCategory.getAll,
);

router.get(
  '/broadcast-template-categories/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_broadcast_template_category,
        feature.update_broadcast_template_category,
        feature.delete_broadcast_template_category,
        feature.create_broadcast_template,
        feature.update_broadcast_template,
      ]),
    );
  },
  TemplateCategory.getDetail,
);

router.post(
  '/broadcast-template-categories',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.create_broadcast_template_category]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  TemplateCategory.create,
);

router.put(
  '/broadcast-template-categories/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.update_broadcast_template_category]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  TemplateCategory.update,
);

router.delete(
  '/broadcast-template-categories/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.delete_broadcast_template_category]),
    );
  },
  TemplateCategory.delete,
);

//* Meta Template Category

router.get(
  '/meta-template-categories',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_meta_template_category,
        feature.create_meta_template_category,
        feature.update_meta_template_category,
        feature.delete_meta_template_category,
        feature.create_broadcast_template,
        feature.update_broadcast_template,
      ]),
    );
  },
  MetaTemplateCategory.getAll,
);

router.get(
  '/meta-template-categories/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_meta_template_category,
        feature.update_meta_template_category,
        feature.delete_meta_template_category,
        feature.create_broadcast_template,
        feature.update_broadcast_template,
      ]),
    );
  },
  MetaTemplateCategory.getDetail,
);

router.post(
  '/meta-template-categories',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.create_meta_template_category]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  MetaTemplateCategory.create,
);

router.put(
  '/meta-template-categories/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.update_meta_template_category]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  MetaTemplateCategory.update,
);

router.delete(
  '/meta-template-categories/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.delete_meta_template_category]),
    );
  },
  MetaTemplateCategory.delete,
);

//* Template Header Type
router.get(
  '/broadcast-template-header-types',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_broadcast_template_header_type,
        feature.create_broadcast_template_header_type,
        feature.update_broadcast_template_header_type,
        feature.delete_broadcast_template_header_type,
        feature.create_broadcast_template,
        feature.update_broadcast_template,
      ]),
    );
  },
  TemplateHeaderType.getAll,
);

router.get(
  '/broadcast-template-header-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_broadcast_template_header_type,
        feature.update_broadcast_template_header_type,
        feature.delete_broadcast_template_header_type,
        feature.create_broadcast_template,
        feature.update_broadcast_template,
      ]),
    );
  },
  TemplateHeaderType.getDetail,
);

router.post(
  '/broadcast-template-header-types',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.create_broadcast_template_header_type]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  TemplateHeaderType.create,
);

router.put(
  '/broadcast-template-header-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.update_broadcast_template_header_type]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  TemplateHeaderType.update,
);

router.delete(
  '/broadcast-template-header-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.delete_broadcast_template_header_type]),
    );
  },
  TemplateHeaderType.delete,
);

// * Meta Language
router.get(
  '/meta-languages',
  async (req, res, next) => {
    Authentication.authenticate(req, res, next, null);
  },
  MetaLanguage.getAll,
);

// * Passenger Status
router.get(
  '/passenger-statuses',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_passenger_status,
        feature.create_passenger_status,
        feature.update_passenger_status,
        feature.delete_passenger_status,
        feature.absent_vehicle_schedule,
      ]),
    );
  },
  PassengerStatus.getAll,
);

router.get(
  '/passenger-statuses/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_passenger_status,
        feature.update_passenger_status,
        feature.delete_passenger_status,
        feature.absent_vehicle_schedule,
      ]),
    );
  },
  PassengerStatus.getDetail,
);

router.post(
  '/passenger-statuses',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.create_passenger_status]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  PassengerStatus.create,
);

router.put(
  '/passenger-statuses/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.update_passenger_status]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  PassengerStatus.update,
);

router.delete(
  '/passenger-statuses/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.delete_passenger_status]),
    );
  },
  PassengerStatus.delete,
);

// * Menu Type
router.get(
  '/menu-types',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_menu_type,
        feature.create_menu_type,
        feature.update_menu_type,
        feature.delete_menu_type,
      ]),
    );
  },
  MenuType.getAll,
);

router.get(
  '/menu-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_menu_type,
        feature.update_menu_type,
        feature.delete_menu_type,
      ]),
    );
  },
  MenuType.getDetail,
);

router.post(
  '/menu-types',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.create_menu_type]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  MenuType.create,
);

router.put(
  '/menu-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.update_menu_type]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  MenuType.update,
);

router.delete(
  '/menu-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.delete_menu_type]),
    );
  },
  MenuType.delete,
);

// * Food Type
router.get(
  '/food-types',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_food_type,
        feature.create_food_type,
        feature.update_food_type,
        feature.delete_food_type,
      ]),
    );
  },
  FoodType.getAll,
);

router.get(
  '/food-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_food_type,
        feature.update_food_type,
        feature.delete_food_type,
      ]),
    );
  },
  FoodType.getDetail,
);

router.post(
  '/food-types',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.create_food_type]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  FoodType.create,
);

router.put(
  '/food-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.update_food_type]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  FoodType.update,
);

router.delete(
  '/food-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.delete_food_type]),
    );
  },
  FoodType.delete,
);

// * Vehicle Schedule Status
router.get(
  '/vehicle-schedule-statuses',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_vehicle_schedule_status,
        feature.create_vehicle_schedule_status,
        feature.update_vehicle_schedule_status,
        feature.delete_vehicle_schedule_status,
        feature.progress_vehicle_schedule,
      ]),
    );
  },
  VehicleScheduleStatus.getAll,
);

router.get(
  '/vehicle-schedule-statuses/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_vehicle_schedule_status,
        feature.update_vehicle_schedule_status,
        feature.delete_vehicle_schedule_status,
        feature.progress_vehicle_schedule,
      ]),
    );
  },
  VehicleScheduleStatus.getDetail,
);

router.post(
  '/vehicle-schedule-statuses',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.create_vehicle_schedule_status]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  VehicleScheduleStatus.create,
);

router.put(
  '/vehicle-schedule-statuses/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.update_vehicle_schedule_status]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  VehicleScheduleStatus.update,
);

router.delete(
  '/vehicle-schedule-statuses/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.delete_vehicle_schedule_status]),
    );
  },
  VehicleScheduleStatus.delete,
);

// * Vehicle Type

router.get(
  '/vehicle-types',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_vehicle_type,
        feature.create_vehicle_type,
        feature.update_vehicle_type,
        feature.delete_vehicle_type,
      ]),
    );
  },
  VehicleType.getAll,
);

router.get(
  '/vehicle-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_vehicle_type,
        feature.update_vehicle_type,
        feature.delete_vehicle_type,
      ]),
    );
  },
  VehicleType.getDetail,
);

router.post(
  '/vehicle-types',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.create_vehicle_type]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  VehicleType.create,
);

router.put(
  '/vehicle-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.update_vehicle_type]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  VehicleType.update,
);

router.delete(
  '/vehicle-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.delete_vehicle_type]),
    );
  },
  VehicleType.delete,
);

// * Food Schedule Status
router.get(
  '/food-schedule-statuses',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_fnb_schedule_status,
        feature.create_fnb_schedule_status,
        feature.update_fnb_schedule_status,
        feature.delete_fnb_schedule_status,
      ]),
    );
  },
  FoodScheduleStatus.getAll,
);

router.get(
  '/food-schedule-statuses/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_fnb_schedule_status,
        feature.update_fnb_schedule_status,
        feature.delete_fnb_schedule_status,
      ]),
    );
  },
  FoodScheduleStatus.getDetail,
);

router.post(
  '/food-schedule-statuses',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.create_fnb_schedule_status]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  FoodScheduleStatus.create,
);

router.put(
  '/food-schedule-statuses/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.update_fnb_schedule_status]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  FoodScheduleStatus.update,
);

router.delete(
  '/food-schedule-statuses/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.delete_fnb_schedule_status]),
    );
  },
  FoodScheduleStatus.delete,
);

// * Committee Type

router.get(
  '/committee-types',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_committee_type,
        feature.create_committee_type,
        feature.update_committee_type,
        feature.delete_committee_type,
      ]),
    );
  },
  CommitteeType.getAll,
);

router.get(
  '/committee-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_committee_type,
        feature.update_committee_type,
        feature.delete_committee_type,
      ]),
    );
  },
  CommitteeType.getDetail,
);

router.post(
  '/committee-types',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.create_committee_type]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  CommitteeType.create,
);

router.put(
  '/committee-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.update_committee_type]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  CommitteeType.update,
);

router.delete(
  '/committee-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.delete_committee_type]),
    );
  },
  CommitteeType.delete,
);

router.get(
  '/coordinates',
  async (req, res, next) => {
    Authentication.authenticate(req, res, next, null);
  },
  LocationController.coordinate,
);

module.exports = router;
