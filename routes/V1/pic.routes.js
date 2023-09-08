const router = require('express').Router();
const { check } = require('express-validator');
const features = require('../../helpers/features.helper');
const ValidateMiddleware = require('../../middlewares/validate.middleware');
const Authentication = require('../../middlewares/auth.middleware');
const PICController = require('../../controllers/pic.controller');

router.post(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.create_pic]),
    );
  },
  [
    check('userId', 'userId attribute must be integer').isInt(),
    check('typeId', 'typeId attribute must be integer').isInt(),
  ],
  ValidateMiddleware.result,
  PICController.create,
);

router.get(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_pic,
        feature.create_pic,
        feature.update_pic,
        feature.delete_pic,
      ]),
    );
  },
  PICController.getAll,
);

router.get(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_pic,
        feature.create_pic,
        feature.update_pic,
        feature.delete_pic,
      ]),
    );
  },
  PICController.getDetail,
);
router.put(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.update_pic]),
    );
  },
  [
    check('userId', 'userId attribute must be integer').isInt(),
    check('typeId', 'typeId attribute must be integer').isInt(),
  ],
  ValidateMiddleware.result,
  PICController.update,
);

router.delete(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.delete_pic]),
    );
  },
  PICController.delete,
);

module.exports = router;
