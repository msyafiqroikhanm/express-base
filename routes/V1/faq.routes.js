const router = require('express').Router();
const { check } = require('express-validator');
const features = require('../../helpers/features.helper');
const FAQController = require('../../controllers/faq.controller');
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
        feature.view_faq,
        feature.create_faq,
        feature.update_faq,
        feature.delete_faq,
      ]),
    );
  },
  FAQController.getAll,
);

router.get(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_faq,
        feature.update_faq,
        feature.delete_faq,
      ]),
    );
  },
  FAQController.getDetail,
);

router.post(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.create_faq,
      ]),
    );
  },
  [
    check('typeId', 'Type Id attribute must be an integer').isInt(),
    check('title', 'Title attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  FAQController.create,
);

router.put(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.update_faq,
      ]),
    );
  },
  [
    check('typeId', 'Type Id attribute must be an integer').isInt(),
    check('title', 'Title attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  FAQController.update,
);

router.delete(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.delete_faq,
      ]),
    );
  },
  FAQController.delete,
);

module.exports = router;
