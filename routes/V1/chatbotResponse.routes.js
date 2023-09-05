const router = require('express').Router();
const { check } = require('express-validator');
const features = require('../../helpers/features.helper');
const ChatbotResponseController = require('../../controllers/chatbotResponse.controller');
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
        feature.view_chatbot_response,
        feature.create_chatbot_response,
        feature.update_chatbot_response,
        feature.delete_chatbot_response,
      ]),
    );
  },
  ChatbotResponseController.getAll,
);

router.get(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_chatbot_response,
        feature.update_chatbot_response,
        feature.delete_chatbot_response,
      ]),
    );
  },
  ChatbotResponseController.getDetail,
);

router.post(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.create_chatbot_response,
      ]),
    );
  },
  [
    check('responseTypeId', 'Response Type Id attribute can\'t be empty').notEmpty(),
    check('message', 'Message attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  ChatbotResponseController.create,
);

router.put(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.update_chatbot_response,
      ]),
    );
  },
  [
    check('responseTypeId', 'Response Type Id attribute can\'t be empty').notEmpty(),
    check('message', 'Message attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  ChatbotResponseController.update,
);

router.post(
  '/:id/activate',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.activate_chatbot_response,
      ]),
    );
  },
  ChatbotResponseController.activate,
);

router.delete(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.delete_chatbot_response,
      ]),
    );
  },
  ChatbotResponseController.delete,
);

module.exports = router;
