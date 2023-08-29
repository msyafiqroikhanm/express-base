const router = require('express').Router();
const { check, param } = require('express-validator');
const features = require('../../helpers/features.helper');
const qrController = require('../../controllers/qr.controller');
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
        feature.view_qr,
        feature.create_qr,
        feature.update_qr,
        feature.delete_qr,
      ]),
    );
  },
  qrController.getAll,
);

router.get(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_qr,
        feature.update_qr,
        feature.delete_qr,
      ]),
    );
  },
  qrController.getDetail,
);

router.post(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.create_qr,
      ]),
    );
  },
  [
    check('templateId', 'Template Id attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  qrController.create,
);

router.put(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.update_qr,
      ]),
    );
  },
  [
    param('id', 'Template Id attribute can\'t be empty').notEmpty(),
    check('templateId', 'Template Id attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  qrController.update,
);

router.delete(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.delete_qr,
      ]),
    );
  },
  qrController.delete,
);

module.exports = router;
