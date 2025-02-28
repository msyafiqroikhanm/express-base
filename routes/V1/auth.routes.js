/* eslint-disable comma-dangle */
const router = require('express').Router();
const { check } = require('express-validator');
const AuthController = require('../../controllers/auth.controller');
const ValidateMiddleware = require('../../middlewares/validate.middleware');
const Authentication = require('../../middlewares/auth.middleware');
const ResponseFormatter = require('../../helpers/responseFormatter.helper');

router.post(
  '/login',
  [
    check('user', 'Atribut user tidak boleh kosong').notEmpty(),
    check('password', 'Atribut password tidak boleh kosong').notEmpty(),
  ],
  ValidateMiddleware.result,
  AuthController.login
);

// router.get('/logout', AuthMiddleware.authenticate, AuthController.logout);

router.get(
  '/check-login',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      null,
    );
  },
  (req, res) => ResponseFormatter.success200(res, 'Token Verified')
);

module.exports = router;
