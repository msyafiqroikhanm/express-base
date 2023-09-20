const router = require('express').Router();
const { check } = require('express-validator');
const features = require('../../helpers/features.helper');
const ValidateMiddleware = require('../../middlewares/validate.middleware');
const Authentication = require('../../middlewares/auth.middleware');
const VendorController = require('../../controllers/vendor.controller');

router.get(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_vendor,
        feature.create_vendor,
        feature.update_vendor,
        feature.delete_vendor,
      ]),
    );
  },
  Authentication.transportation,
  VendorController.getAll,
);

router.get(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_vendor,
        feature.update_vendor,
        feature.delete_vendor,
      ]),
    );
  },
  Authentication.transportation,
  VendorController.getDetail,
);

router.post(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.create_vendor,
      ]),
    );
  },
  Authentication.transportation,
  [
    check('picId', "PIC Id attribute can't be empty").notEmpty(),
    check('name', "Name attribute can't be empty").notEmpty(),
    check('phoneNbr', "Phone Number attribute can't be empty").notEmpty(),
    check('email', "Email attribute can't be empty").isEmail(),
    check('address', "Address attribute can't be empty").notEmpty(),
  ],
  ValidateMiddleware.result,
  VendorController.create,
);

router.put(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.update_vendor,
      ]),
    );
  },
  Authentication.transportation,
  [
    check('picId', "PIC Id attribute can't be empty").notEmpty(),
    check('name', "Name attribute can't be empty").notEmpty(),
    check('phoneNbr', "Phone Number attribute can't be empty").notEmpty(),
    check('email', "Email attribute can't be empty").isEmail(),
    check('address', "Address attribute can't be empty").notEmpty(),
  ],
  ValidateMiddleware.result,
  VendorController.update,
);

router.delete(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.delete_vendor,
      ]),
    );
  },
  Authentication.transportation,
  VendorController.delete,
);

module.exports = router;
