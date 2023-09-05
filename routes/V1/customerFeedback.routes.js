const router = require('express').Router();
const { check } = require('express-validator');
const features = require('../../helpers/features.helper');
const ChatbotResponseController = require('../../controllers/');
const ValidateMiddleware = require('../../middlewares/validate.middleware');
const Authentication = require('../../middlewares/auth.middleware');

module.exports = router;
