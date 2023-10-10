const router = require('express').Router();
const FNBFeedbackController = require('../../controllers/fnbFeedback.controller');
// const { check } = require('express-validator');
const features = require('../../helpers/features.helper');
// const ValidateMiddleware = require('../../middlewares/validate.middleware');
const Authentication = require('../../middlewares/auth.middleware');

router.get(
  '/summaries',
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
      ]),
    );
  },
  Authentication.fnb,
  FNBFeedbackController.summary,
);
router.get(
  '/summaries/contingents',
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
      ]),
    );
  },
  Authentication.fnb,
  FNBFeedbackController.summaryContingent,
);

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
      ]),
    );
  },
  Authentication.fnb,
  FNBFeedbackController.getAll,
);

module.exports = router;
