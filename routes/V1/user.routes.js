const router = require('express').Router();
const { check } = require('express-validator');
const userController = require('../../controllers/user.controller');
const ValidateMiddleware = require('../../middlewares/validate.middleware');

router.get(
  '/',
  userController.getAll,
);

router.get(
  '/:id',
  userController.getDetail,
);

router.post(
  '/',
  [
    check('roleId', 'RoleId attribute can\'t be empty').notEmpty(),
    check('name', 'Name attribute can\'t be empty').notEmpty(),
    check('username', 'Username attribute can\'t be empty').notEmpty(),
    check('password', 'Password attribute can\'t be empty').notEmpty(),
    check('email', 'Email attribute can\'t be empty').notEmpty(),
    check('phoneNbr', 'Phone Number attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  userController.create,
);

router.put(
  '/:id',
  [
    check('roleId', 'RoleId attribute can\'t be empty').notEmpty(),
    check('name', 'Name attribute can\'t be empty').notEmpty(),
    check('email', 'Email attribute can\'t be empty').notEmpty(),
    check('phoneNbr', 'Phone Number attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  userController.update,
);

router.delete(
  '/:id',
  userController.delete,
);

router.put(
  '/:id/change-password',
  [
    check('oldPassword', 'Old Password attribute can\'t be empty').notEmpty(),
    check('newPassword', 'New Password attribute can\'t be empty').notEmpty(),
    check('newRePassword', 'New Re-Password attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  userController.changePassword,
);

module.exports = router;
