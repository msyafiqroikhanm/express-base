const router = require('express').Router();
const { check } = require('express-validator');
const features = require('../../helpers/features.helper');
const ArrivalDepartureController = require('../../controllers/arrivalDeparture.controller');
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
        feature.view_arrival_departure,
        feature.create_arrival_departure,
        feature.update_arrival_departure,
        feature.delete_arrival_departure,
      ]),
    );
  },
  Authentication.participant,
  ArrivalDepartureController.getAll,
);

router.get(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_arrival_departure,
        feature.update_arrival_departure,
        feature.delete_arrival_departure,
      ]),
    );
  },
  Authentication.participant,
  ArrivalDepartureController.getDetail,
);

router.post(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.create_arrival_departure,
      ]),
    );
  },
  [
    check('contingentId', 'Contingent Id attribute can\'t be empty').notEmpty(),
    check('name', 'Name attribute can\'t be empty').notEmpty(),
    check('otherLocation', 'Location attribute can\'t be empty').notEmpty(),
    check('type', 'Type attribute can\'t be empty').notEmpty(),
    check('transportation', 'transportation At attribute can\'t be empty').notEmpty(),
    check('totalParticipant', 'totalParticipant At attribute can\'t be empty').notEmpty(),
    check('time', 'time At attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  Authentication.participant,
  ArrivalDepartureController.create,
);

router.put(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.update_arrival_departure,
      ]),
    );
  },
  [
    check('contingentId', 'Contingent Id attribute can\'t be empty').notEmpty(),
    check('name', 'Name attribute can\'t be empty').notEmpty(),
    check('otherLocation', 'Location attribute can\'t be empty').notEmpty(),
    check('type', 'Type attribute can\'t be empty').notEmpty(),
    check('transportation', 'transportation At attribute can\'t be empty').notEmpty(),
    check('totalParticipant', 'totalParticipant At attribute can\'t be empty').notEmpty(),
    check('time', 'time At attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  Authentication.participant,
  ArrivalDepartureController.update,
);

router.delete(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.delete_arrival_departure,
      ]),
    );
  },
  Authentication.participant,
  ArrivalDepartureController.delete,
);

module.exports = router;
