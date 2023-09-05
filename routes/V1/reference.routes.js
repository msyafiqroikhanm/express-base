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
  InformationCenterTargetType,
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
      await features().then((feature) => [
        feature.update_configuration_category,
      ]),
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
      await features().then((feature) => [
        feature.create_chatbot_response_type,
      ]),
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
      await features().then((feature) => [
        feature.update_chatbot_response_type,
      ]),
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
      await features().then((feature) => [
        feature.delete_chatbot_response_type,
      ]),
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
      await features().then((feature) => [
        feature.create_feedback_type,
      ]),
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
      await features().then((feature) => [
        feature.update_feedback_type,
      ]),
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
      await features().then((feature) => [
        feature.delete_feedback_type,
      ]),
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
      await features().then((feature) => [
        feature.create_feedback_target,
      ]),
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
      await features().then((feature) => [
        feature.update_feedback_target,
      ]),
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
      await features().then((feature) => [
        feature.delete_feedback_target,
      ]),
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
      await features().then((feature) => [
        feature.create_feedback_status,
      ]),
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
      await features().then((feature) => [
        feature.update_feedback_status,
      ]),
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
      await features().then((feature) => [
        feature.delete_feedback_status,
      ]),
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
      await features().then((feature) => [
        feature.create_faq_type,
      ]),
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
      await features().then((feature) => [
        feature.update_faq_type,
      ]),
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
      await features().then((feature) => [
        feature.delete_faq_type,
      ]),
    );
  },
  FAQType.delete,
);

//* Template Category

router.get(
  '/template-categories',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_template_category,
        feature.create_template_category,
        feature.update_template_category,
        feature.delete_template_category,
      ]),
    );
  },
  TemplateCategory.getAll,
);

router.get(
  '/template-categories/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_template_category,
        feature.update_template_category,
        feature.delete_template_category,
      ]),
    );
  },
  TemplateCategory.getDetail,
);

router.post(
  '/template-categories',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.create_template_category,
      ]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  TemplateCategory.create,
);

router.put(
  '/template-categories/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.update_template_category,
      ]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  TemplateCategory.update,
);

router.delete(
  '/template-categories/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.delete_template_category,
      ]),
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
      await features().then((feature) => [
        feature.create_meta_template_category,
      ]),
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
      await features().then((feature) => [
        feature.update_meta_template_category,
      ]),
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
      await features().then((feature) => [
        feature.delete_meta_template_category,
      ]),
    );
  },
  MetaTemplateCategory.delete,
);

//* Template Header Type

router.get(
  '/template-header-types',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_template_header_type,
        feature.create_template_header_type,
        feature.update_template_header_type,
        feature.delete_template_header_type,
      ]),
    );
  },
  TemplateHeaderType.getAll,
);

router.get(
  '/template-header-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_template_header_type,
        feature.update_template_header_type,
        feature.delete_template_header_type,
      ]),
    );
  },
  TemplateHeaderType.getDetail,
);

router.post(
  '/template-header-types',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.create_template_header_type,
      ]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  TemplateHeaderType.create,
);

router.put(
  '/template-header-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.update_template_header_type,
      ]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  TemplateHeaderType.update,
);

router.delete(
  '/template-header-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.delete_template_header_type,
      ]),
    );
  },
  TemplateHeaderType.delete,
);

//* Information Center Target Type

router.get(
  '/information-center-target-types',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_information_center_target_type,
        feature.create_information_center_target_type,
        feature.update_information_center_target_type,
        feature.delete_information_center_target_type,
      ]),
    );
  },
  InformationCenterTargetType.getAll,
);

router.get(
  '/information-center-target-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_information_center_target_type,
        feature.update_information_center_target_type,
        feature.delete_information_center_target_type,
      ]),
    );
  },
  InformationCenterTargetType.getDetail,
);

router.post(
  '/information-center-target-types',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.create_information_center_target_type,
      ]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  InformationCenterTargetType.create,
);

router.put(
  '/information-center-target-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.update_information_center_target_type,
      ]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  InformationCenterTargetType.update,
);

router.delete(
  '/information-center-target-types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.delete_information_center_target_type,
      ]),
    );
  },
  InformationCenterTargetType.delete,
);

module.exports = router;
