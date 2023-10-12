const router = require('express').Router();
const { check } = require('express-validator');
const { uploadParticipant } = require('../../services/multerStorage.service');
const ValidateMiddleware = require('../../middlewares/validate.middleware');
const ProfileController = require('../../controllers/profile.controller');
const AuthMiddleware = require('../../middlewares/auth.middleware');

router.get(
  '/',
  async (req, res, next) => {
    AuthMiddleware.authenticate(
      req,
      res,
      next,
      null,
    );
  },
  ProfileController.get,
);

router.patch(
  '/',
  async (req, res, next) => {
    AuthMiddleware.authenticate(
      req,
      res,
      next,
      null,
    );
  },
  uploadParticipant.fields([
    {
      name: 'participantImage',
      maxCount: 1,
    },
    {
      name: 'identityFile',
      maxCount: 1,
    },
    {
      name: 'baptismFile',
      maxCount: 1,
    },
    {
      name: 'referenceFile',
      maxCount: 1,
    },
  ]),
  [
    check('name', "name attribute can't be empty").notEmpty(),
    check('identityTypeId', "Identity type id attribute can't be empty").notEmpty(),
    check('identityNo', "Identity number attribute can't be empty").notEmpty(),
    check('gender', "gender attribute can't be empty").notEmpty(),
    check('birthDate', "Birth date attribute can't be empty").isDate(),
    check('email', "Email attribute can't be empty").isEmail(),
    check('phoneNbr', "Phone number attribute can't be empty").notEmpty(),
  ],
  ValidateMiddleware.result,
  ProfileController.update,
);

router.put(
  '/change-password',
  async (req, res, next) => {
    AuthMiddleware.authenticate(
      req,
      res,
      next,
      null,
    );
  },
  [
    check('oldPassword', "Old Password attribute can't be empty").notEmpty(),
    check('newPassword', "New Password attribute can't be empty").notEmpty(),
    check('newRePassword', "New Re-Password attribute can't be empty").notEmpty(),
  ],
  ValidateMiddleware.result,
  ProfileController.changePassword,
);

module.exports = router;
