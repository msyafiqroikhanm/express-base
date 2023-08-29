const router = require('express').Router();
const { check } = require('express-validator');
const features = require('../../helpers/features.helper');
const templateController = require('../../controllers/qrTemplate.controller');
const { uploadImage } = require('../../services/multerStorage.service');
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
        feature.view_qr_template,
        feature.create_qr_template,
        feature.update_qr_template,
        feature.delete_qr_template,
      ]),
    );
  },
  templateController.getAll,
);

router.get(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_qr_template,
        feature.update_qr_template,
        feature.delete_qr_template,
      ]),
    );
  },
  templateController.getDetail,
);

router.post(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.create_qr_template,
      ]),
    );
  },
  uploadImage.single('qrTemplateImage'),
  [
    check('typeId', 'Name attribute can\'t be empty').notEmpty(),
    check('name', 'Name attribute can\'t be empty').notEmpty(),
    check('xCoordinate', 'xCoordinate attribute can\'t be empty').notEmpty(),
    check('yCoordinate', 'yCoordinate attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.resultWithMandatoryFile,
  templateController.create,
);

router.put(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.update_qr_template,
      ]),
    );
  },
  uploadImage.single('qrTemplateImage'),
  [
    check('typeId', 'Name attribute can\'t be empty').notEmpty(),
    check('name', 'Name attribute can\'t be empty').notEmpty(),
    check('xCoordinate', 'xCoordinate attribute can\'t be empty').notEmpty(),
    check('yCoordinate', 'yCoordinate attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.resultWithMandatoryFile,
  templateController.update,
);

router.delete(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.delete_qr_template,
      ]),
    );
  },
  templateController.delete,
);

module.exports = router;
