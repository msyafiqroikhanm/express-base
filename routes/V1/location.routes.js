const router = require('express').Router();
const { check } = require('express-validator');
const LocationController = require('../../controllers/location.controller');
const features = require('../../helpers/features.helper');
const Authentication = require('../../middlewares/auth.middleware');
const ValidateMiddleware = require('../../middlewares/validate.middleware');

router.get(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_location,
        feature.create_location,
        feature.update_location,
        feature.delete_location,
        feature.view_room,
        feature.create_room,
        feature.update_room,
        feature.delete_room,
        feature.view_lodger,
        feature.create_lodger,
        feature.update_lodger,
        feature.delete_lodger,
      ]),
    );
  },
  Authentication.accomodation,
  LocationController.getAll,
);

router.get(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_location,
        feature.create_location,
        feature.update_location,
        feature.delete_location,
        feature.view_room,
        feature.create_room,
        feature.update_room,
        feature.delete_room,
        feature.view_lodger,
        feature.create_lodger,
        feature.update_lodger,
        feature.delete_lodger,
      ]),
    );
  },
  Authentication.accomodation,
  LocationController.getDetail,
);

router.post(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.create_location]),
    );
  },
  [
    check('typeId', 'typeId attribute must be integer').isInt(),
    check('name', "name attribute can't be empty").notEmpty(),
    check('description', "description attribute can't be empty").notEmpty(),
    check('address', "address attribute can't be empty").notEmpty(),
    check('phoneNbr', "phoneNbr attribute can't be empty").notEmpty(),
    check('latitude', "latitude attribute can't be empty").notEmpty(),
    check('longtitude', "longtitude attribute can't be empty").notEmpty(),
  ],
  ValidateMiddleware.result,
  LocationController.create,
);

router.put(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.update_location]),
    );
  },
  Authentication.accomodation,
  LocationController.update,
);

router.delete(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.delete_location]),
    );
  },
  Authentication.accomodation,
  LocationController.delete,
);
module.exports = router;
