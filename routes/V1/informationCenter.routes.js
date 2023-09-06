const router = require('express').Router();
const { check } = require('express-validator');
const features = require('../../helpers/features.helper');
const InformationCenterController = require('../../controllers/informationCenter.controller');
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
        feature.view_information_center,
        feature.create_information_center,
        feature.update_information_center,
        feature.delete_information_center,
      ]),
    );
  },
  InformationCenterController.getAll,
);

router.get(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_information_center,
        feature.update_information_center,
        feature.delete_information_center,
      ]),
    );
  },
  InformationCenterController.getDetail,
);

router.post(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.create_information_center,
      ]),
    );
  },
  [
    check('title', 'Title attribute can\'t be empty').notEmpty(),
    check('description', 'Description attribute can\'t be empty').notEmpty(),
    check('participantTypes', 'Participant Type must be an array').isArray(),
  ],
  ValidateMiddleware.result,
  InformationCenterController.create,
);

router.put(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.update_information_center,
      ]),
    );
  },
  [
    check('title', 'Title attribute can\'t be empty').notEmpty(),
    check('description', 'Description attribute can\'t be empty').notEmpty(),
    check('participantTypes', 'Participant Type must be an array').isArray(),
  ],
  ValidateMiddleware.result,
  InformationCenterController.update,
);

router.delete(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.delete_information_center,
      ]),
    );
  },
  InformationCenterController.delete,
);

module.exports = router;
