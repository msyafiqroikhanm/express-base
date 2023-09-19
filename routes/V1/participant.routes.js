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
        feature.create_user,
        feature.update_user,
        feature.create_broadcast,
        feature.update_broadcast,
        feature.create_participant_committe,
      ]),
    );
  },
  Authentication.participant,
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
        feature.create_broadcast,
        feature.update_broadcast,
        feature.create_participant_committe,
      ]),
    );
  },
  Authentication.participant,
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
    check('birthDate', "Birth Date attribute can't be empty").isDate(),
    check('identityNo', "Identity Number attribute can't be empty").notEmpty(),
    check('phoneNbr', "Phone Number attribute can't be empty").isMobilePhone('id-ID'),
    check('email', "Email attribute can't be empty").isEmail(),
    check('address', "Address attribute can't be empty").notEmpty(),
  ],
  ValidateMiddleware.result,
  Authentication.participant,
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
  Authentication.participant,
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
    check('birthDate', "Birth Date attribute can't be empty").isDate(),
    check('identityNo', "Identity Number attribute can't be empty").notEmpty(),
    check('phoneNbr', "Phone Number attribute can't be empty").isMobilePhone('id-ID'),
    check('email', "Email attribute can't be empty").isEmail(),
    check('address', "Address attribute can't be empty").notEmpty(),
  ],
  ValidateMiddleware.result,
  Authentication.participant,
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
  Authentication.participant,
  ParticipantController.delete,
);

router.post(
  '/track',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.track_participant,
        feature.view_participant,
      ]),
    );
  },
  [
    check('qrCode', "qrCode attribute can't be empty").notEmpty(),
    check('latitude', "Latitude attribute can't be empty").notEmpty(),
    check('longtitude', "Longtitude attribute can't be empty").notEmpty(),
  ],
  ValidateMiddleware.result,
  Authentication.participant,
  ParticipantController.track,
);

router.post(
  '/committees/import',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.create_participant_committee,
      ]),
    );
  },
  uploadDocument.single('participantDocument'),
  ValidateMiddleware.resultWithMandatoryFile,
  ParticipantController.createCommitteeViaImport,
);

router.post(
  '/committees',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.create_participant_committee,
      ]),
    );
  },
  uploadImage.single('committeeImage'),
  [
    check('committeeTypeId', "Committee Type Id attribute can't be empty").notEmpty(),
    check('identityTypeId', "Identity type Id attribute can't be empty").notEmpty(),
    check('name', "Name attribute can't be empty").notEmpty(),
    check('gender', "Gender attribute can't be empty").notEmpty(),
    check('birthDate', "Birth Date attribute can't be empty").isDate(),
    check('identityNo', "Identity Number attribute can't be empty").notEmpty(),
    check('phoneNbr', "Phone Number attribute can't be empty").isMobilePhone('id-ID'),
    check('email', "Email attribute can't be empty").isEmail(),
    check('address', "Address attribute can't be empty").notEmpty(),
  ],
  ValidateMiddleware.result,
  ParticipantController.createCommittee,
);

router.put(
  '/committees/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.update_participant_committee,
      ]),
    );
  },
  uploadImage.single('committeeImage'),
  [
    check('committeeTypeId', "Committee Type Id attribute can't be empty").notEmpty(),
    check('identityTypeId', "Identity type Id attribute can't be empty").notEmpty(),
    check('name', "Name attribute can't be empty").notEmpty(),
    check('gender', "Gender attribute can't be empty").notEmpty(),
    check('birthDate', "Birth Date attribute can't be empty").isDate(),
    check('identityNo', "Identity Number attribute can't be empty").notEmpty(),
    check('phoneNbr', "Phone Number attribute can't be empty").isMobilePhone('id-ID'),
    check('email', "Email attribute can't be empty").isEmail(),
    check('address', "Address attribute can't be empty").notEmpty(),
  ],
  ValidateMiddleware.result,
  ParticipantController.updateCommittee,
);

router.get(
  '/:id/transportations',
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
      ]),
    );
  },
  Authentication.participant,
  ParticipantController.TransportationSchedule,
);

module.exports = router;
