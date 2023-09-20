const router = require('express').Router();
const { check } = require('express-validator');
const features = require('../../helpers/features.helper');
const ValidateMiddleware = require('../../middlewares/validate.middleware');
const Authentication = require('../../middlewares/auth.middleware');
const RoomController = require('../../controllers/room.controller');
const { RoomType } = require('../../controllers/reference.controller');

//* Room Types
router.post(
  '/types',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.create_room_type]),
    );
  },
  [
    check('name', "Name attribute can't be empty").notEmpty(),
    check('locationId', "locationId attribute can't be empty").notEmpty(),
  ],
  ValidateMiddleware.result,
  Authentication.accomodation,
  RoomType.create,
);
router.get(
  '/types',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_room_type,
        feature.create_room_type,
        feature.update_room_type,
        feature.delete_room_type,
      ]),
    );
  },
  Authentication.accomodation,
  RoomType.getAll,
);
router.get(
  '/types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_room_type,
        feature.create_room_type,
        feature.update_room_type,
        feature.delete_room_type,
      ]),
    );
  },
  Authentication.accomodation,
  RoomType.getDetail,
);
router.put(
  '/types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_room_type,
        feature.create_room_type,
        feature.update_room_type,
        feature.delete_room_type,
      ]),
    );
  },
  [check('name', "Name attribute can't be empty").notEmpty()],
  ValidateMiddleware.result,
  Authentication.accomodation,
  RoomType.update,
);
router.delete(
  '/types/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.delete_room_type]),
    );
  },
  Authentication.accomodation,
  RoomType.delete,
);

//* ROOM
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
    // check('statusId', 'statusId attribute must be integer').isInt(),
    check('name', "name attribute can't be empty").notEmpty(),
    check('floor', "floor attribute can't be empty").notEmpty(),
    check('capacity', 'capacity attribute must be integer').isInt(),
    // check('occupied', 'occupied attribute must be integer').isInt(),
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
