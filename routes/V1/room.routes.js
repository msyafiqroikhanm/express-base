const router = require('express').Router();
const { check } = require('express-validator');
const features = require('../../helpers/features.helper');
const ValidateMiddleware = require('../../middlewares/validate.middleware');
const Authentication = require('../../middlewares/auth.middleware');
const RoomController = require('../../controllers/room.controller');

router.get(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
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
  RoomController.getAll,
);

router.get(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
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
  RoomController.getDetail,
);

router.post(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.create_room]),
    );
  },
  [
    check('locationId', 'locationId attribute must be integer').isInt(),
    check('typeId', 'typeId attribute must be integer').isInt(),
    check('statusId', 'statusId attribute must be integer').isInt(),
    check('name', "name attribute can't be empty").notEmpty(),
    check('floor', "floor attribute can't be empty").notEmpty(),
    check('capacity', 'capacity attribute must be integer').isInt(),
    check('occupied', 'occupied attribute must be integer').isInt(),
  ],
  ValidateMiddleware.result,
  Authentication.accomodation,
  RoomController.create,
);

router.put(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.update_room]),
    );
  },
  Authentication.accomodation,
  RoomController.update,
);

router.delete(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.delete_room]),
    );
  },
  Authentication.accomodation,
  RoomController.delete,
);

module.exports = router;
