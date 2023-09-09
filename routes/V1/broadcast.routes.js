const router = require('express').Router();
const { check } = require('express-validator');
const features = require('../../helpers/features.helper');
const { uploadCombine } = require('../../services/multerStorage.service');
const BroadcastController = require('../../controllers/broadcast.controller');
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
        feature.view_broadcast,
        feature.create_broadcast,
        feature.update_broadcast,
        feature.delete_broadcast,
      ]),
    );
  },
  BroadcastController.getAll,
);

router.get(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_broadcast,
        feature.update_broadcast,
        feature.delete_broadcast,
      ]),
    );
  },
  BroadcastController.getDetail,
);

router.post(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.create_broadcast,
      ]),
    );
  },
  uploadCombine.single('broadcastFile'),
  [
    check('templateId', 'Template Id attribute can\'t be empty').notEmpty(),
    check('name', 'Name attribute can\'t be empty').notEmpty(),
    check('sentAt', 'Sent At attribute can\'t be empty').notEmpty(),
    check('receivers', 'Receivers At attribute can\'t be empty').isArray(),
  ],
  ValidateMiddleware.result,
  BroadcastController.create,
);

router.put(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.update_broadcast,
      ]),
    );
  },
  uploadCombine.single('broadcastFile'),
  [
    check('templateId', 'Template Id attribute can\'t be empty').notEmpty(),
    check('name', 'Name attribute can\'t be empty').notEmpty(),
    check('sentAt', 'Sent At attribute can\'t be empty').notEmpty(),
    check('receivers', 'Receivers At attribute can\'t be empty').isArray(),
  ],
  ValidateMiddleware.result,
  BroadcastController.update,
);

router.delete(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.delete_broadcast,
      ]),
    );
  },
  BroadcastController.delete,
);

module.exports = router;
