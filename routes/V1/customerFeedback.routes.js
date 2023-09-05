const router = require('express').Router();
const { check } = require('express-validator');
const features = require('../../helpers/features.helper');
const CustomerFeedbackController = require('../../controllers/customerFeedback.controller');
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
        feature.view_feedback,
        feature.create_feedback,
        feature.update_feedback,
        feature.delete_feedback,
      ]),
    );
  },
  CustomerFeedbackController.getAll,
);

router.get(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_feedback,
        feature.update_feedback,
        feature.delete_feedback,
      ]),
    );
  },
  CustomerFeedbackController.getDetail,
);

router.post(
  '/',
  [
    check('typeId', 'Type Id attribute can\'t be empty').notEmpty(),
    check('targetId', 'Target Id attribute can\'t be empty').notEmpty(),
    check('statusId', 'Status Id attribute can\'t be empty').notEmpty(),
    check('longtitude', 'Longtitude attribute can\'t be empty').notEmpty(),
    check('latitude', 'Latitude attribute can\'t be empty').notEmpty(),
    check('message', 'Message attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  CustomerFeedbackController.create,
);

router.put(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.update_feedback,
      ]),
    );
  },
  [
    check('statusId', 'Status Id attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  CustomerFeedbackController.update,
);

router.delete(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.delete_feedback,
      ]),
    );
  },
  CustomerFeedbackController.delete,
);

module.exports = router;
