const router = require('express').Router();
const { check } = require('express-validator');
const { uploadDocument, uploadImage } = require('../../services/multerStorage.service');
const features = require('../../helpers/features.helper');
const ParticipantController = require('../../controllers/participant.controller');
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
        feature.view_participant,
        feature.create_participant,
        feature.update_participant,
        feature.delete_participant,
        feature.track_participant,
        feature.view_lodger,
        feature.create_lodger,
        feature.update_lodger,
        feature.delete_lodger,
        feature.create_group,
        feature.update_group,
      ]),
    );
  },
  ParticipantController.getAll,
);

router.get(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_participant,
        feature.update_participant,
        feature.delete_participant,
        feature.track_participant,
        feature.view_lodger,
        feature.create_lodger,
        feature.update_lodger,
        feature.delete_lodger,
        feature.create_group,
        feature.update_group,
      ]),
    );
  },
  ParticipantController.getDetail,
);

router.post(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.create_participant]),
    );
  },
  uploadImage.single('participantImage'),
  [
    check('contingentId', "Contingent Id attribute can't be empty").notEmpty(),
    check('typeId', "Type Id attribute can't be empty").notEmpty(),
    check('identityTypeId', "Identity type Id attribute can't be empty").notEmpty(),
    check('name', "Name attribute can't be empty").notEmpty(),
    check('gender', "Gender attribute can't be empty").notEmpty(),
    check('birthDate', "Birth Date attribute can't be empty").isDate().notEmpty(),
    check('identityNo', "Identity Number attribute can't be empty").notEmpty(),
    check('phoneNbr', "Phone Number attribute can't be empty").isMobilePhone('id-ID').notEmpty(),
    check('email', "Email attribute can't be empty").isEmail().notEmpty(),
    check('address', "Address attribute can't be empty").notEmpty(),
  ],
  ValidateMiddleware.result,
  ParticipantController.create,
);

router.post(
  '/import',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.create_participant]),
    );
  },
  uploadDocument.single('participantDocument'),
  ValidateMiddleware.resultWithMandatoryFile,
  ParticipantController.createViaImport,
);

router.put(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.update_participant]),
    );
  },
  uploadImage.single('participantImage'),
  [
    check('contingentId', "Contingent Id attribute can't be empty").notEmpty(),
    check('typeId', "Type Id attribute can't be empty").notEmpty(),
    check('identityTypeId', "Identity type Id attribute can't be empty").notEmpty(),
    check('name', "Name attribute can't be empty").notEmpty(),
    check('gender', "Gender attribute can't be empty").notEmpty(),
    check('birthDate', "Birth Date attribute can't be empty").isDate().notEmpty(),
    check('identityNo', "Identity Number attribute can't be empty").notEmpty(),
    check('phoneNbr', "Phone Number attribute can't be empty").isMobilePhone('id-ID').notEmpty(),
    check('email', "Email attribute can't be empty").isEmail().notEmpty(),
    check('address', "Address attribute can't be empty").notEmpty(),
  ],
  ValidateMiddleware.result,
  ParticipantController.update,
);

router.delete(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.delete_participant]),
    );
  },
  ParticipantController.delete,
);

router.post(
  '/track',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.track_participant]),
    );
  },
  [
    check('qrCode', "qrCode attribute can't be empty").notEmpty(),
    check('latitude', "Latitude attribute can't be empty").notEmpty(),
    check('longtitude', "Longtitude attribute can't be empty").notEmpty(),
  ],
  ValidateMiddleware.result,
  ParticipantController.track,
);

module.exports = router;
