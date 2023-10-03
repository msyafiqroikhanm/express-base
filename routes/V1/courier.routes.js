const router = require('express').Router();
const { check } = require('express-validator');
const features = require('../../helpers/features.helper');
const ValidateMiddleware = require('../../middlewares/validate.middleware');
const Authentication = require('../../middlewares/auth.middleware');
const CourierController = require('../../controllers/courier.controller');
const { uploadImage } = require('../../services/multerStorage.service');

router.post(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.create_courier]),
    );
  },
  uploadImage.single('committeeImage'),
  [
    check('name', 'name attribute cant be empty').notEmpty(),
    check('identityTypeId', "Identity type Id attribute can't be empty").notEmpty(),
    check('gender', "Gender attribute can't be empty").notEmpty(),
    check('birthDate', "Birth Date attribute can't be empty").isDate(),
    check('identityNo', "Identity Number attribute can't be empty").notEmpty(),
    check('phoneNbr', 'phoneNbr attribute cant be empty').notEmpty(),
    check('email', "Email attribute can't be empty").isEmail(),
    check('address', "Address attribute can't be empty").notEmpty(),
    check('username', "Username attribute can't be empty").notEmpty(),
    check('password', "Password attribute can't be empty").notEmpty(),
  ],
  ValidateMiddleware.result,
  CourierController.create,
);

router.get(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_courier,
        feature.create_courier,
        feature.update_courier,
        feature.delete_courier,
      ]),
    );
  },
  CourierController.getAll,
);

router.get(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_courier,
        feature.create_courier,
        feature.update_courier,
        feature.delete_courier,
      ]),
    );
  },
  CourierController.getDetail,
);

router.put(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.update_courier]),
    );
  },
  CourierController.update,
);

router.delete(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.delete_courier]),
    );
  },
  CourierController.delete,
);

module.exports = router;
