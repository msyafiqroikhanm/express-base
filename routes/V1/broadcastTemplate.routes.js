const router = require('express').Router();
const { check } = require('express-validator');
const features = require('../../helpers/features.helper');
const { uploadWithMemory } = require('../../services/multerStorage.service');
const BroadcastTemplateController = require('../../controllers/broadcastTemplate.controller');
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
        feature.view_broadcast_template,
        feature.create_broadcast_template,
        feature.update_broadcast_template,
        feature.delete_broadcast_template,
        feature.create_broadcast,
        feature.update_broadcast,
      ]),
    );
  },
  BroadcastTemplateController.getAll,
);

router.get(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_broadcast_template,
        feature.update_broadcast_template,
        feature.delete_broadcast_template,
        feature.create_broadcast,
        feature.update_broadcast,
      ]),
    );
  },
  BroadcastTemplateController.getDetail,
);

router.post(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.create_broadcast_template,
      ]),
    );
  },
  uploadWithMemory.single('file'),
  [
    check('categoryId', 'Category Id attribute can\'t be empty').notEmpty(),
    check('metaCategoryId', 'Meta Category Id attribute can\'t be empty').notEmpty(),
    check('headerTypeId', 'Header Type Id attribute can\'t be empty').notEmpty(),
    check('languageId', 'Language Id attribute can\'t be empty').notEmpty(),
    check('name', 'Name attribute can\'t be empty').notEmpty(),
    check('message', 'Message attribute can\'t be empty').notEmpty(),
    check('messageVariableNumber', 'Message Variable Number attribute must be an integer').isInt(),
    check('messageVariableExample', 'Message Variable Example attribute must be an array').isArray(),
  ],
  ValidateMiddleware.result,
  BroadcastTemplateController.create,
);

router.put(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.update_broadcast_template,
      ]),
    );
  },
  uploadWithMemory.single('file'),
  [
    check('categoryId', 'Category Id attribute can\'t be empty').notEmpty(),
    check('headerTypeId', 'Header Type Id attribute can\'t be empty').notEmpty(),
    check('message', 'Message attribute can\'t be empty').notEmpty(),
    check('messageVariableNumber', 'Message Variable Number attribute must be an integer').isInt(),
    check('messageVariableExample', 'Message Variable Example attribute must be an array').isArray(),
  ],
  ValidateMiddleware.result,
  BroadcastTemplateController.update,
);

router.delete(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.delete_broadcast_template,
      ]),
    );
  },
  BroadcastTemplateController.delete,
);

module.exports = router;
