const router = require('express').Router();
const { check } = require('express-validator');
const features = require('../../helpers/features.helper');
const ValidateMiddleware = require('../../middlewares/validate.middleware');
const Authentication = require('../../middlewares/auth.middleware');
const LodgerController = require('../../controllers/lodger.controller');

router.post(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.create_lodger]),
    );
  },
  [
    check('participantId', 'participantId attribute must be integer').isInt(),
    check('roomId', 'roomId attribute must be integer').isInt(),
    check('reservationIn', 'reservationIn attribute cant be empty').notEmpty(),
    check('reservationOut', 'reservationOut attribute cant be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  LodgerController.create,
);

router.get(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_lodger,
        feature.create_lodger,
        feature.update_lodger,
        feature.delete_lodger,
      ]),
    );
  },
  Authentication.accomodation,
  LodgerController.getAll,
);

router.get(
  '/participants',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_lodger,
        feature.create_lodger,
        feature.update_lodger,
        feature.delete_lodger,
      ]),
    );
  },
  LodgerController.getParticipantsWhoHaveNotReveivedAccomodation,
);

router.get(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_lodger,
        feature.create_lodger,
        feature.update_lodger,
        feature.delete_lodger,
      ]),
    );
  },
  Authentication.accomodation,
  LodgerController.getDetail,
);

router.put(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.update_lodger]),
    );
  },
  Authentication.accomodation,
  LodgerController.update,
);

router.patch(
  '/:id/checkin',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.update_lodger]),
    );
  },
  [check('checkinTime', 'checkinTime attribute cant be empty').notEmpty()],
  ValidateMiddleware.result,
  Authentication.accomodation,
  LodgerController.checkin,
);

router.patch(
  '/:id/checkout',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.update_lodger]),
    );
  },
  [check('checkoutTime', 'checkoutTime attribute cant be empty').notEmpty()],
  ValidateMiddleware.result,
  Authentication.accomodation,
  LodgerController.checkout,
);

router.delete(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.delete_lodger]),
    );
  },
  LodgerController.delete,
);

module.exports = router;
