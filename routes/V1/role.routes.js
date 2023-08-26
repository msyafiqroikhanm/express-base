const router = require('express').Router();
const { check } = require('express-validator');
const roleController = require('../../controllers/role.controller');
const ValidateMiddleware = require('../../middlewares/validate.middleware');

router.get(
  '/',
  roleController.getAll,
);

router.get(
  '/:id',
  roleController.getDetail,
);

router.post(
  '/',
  [
    check('name', 'Name attribute can\'t be empty').notEmpty(),
    check('templateId', 'QR Template attribute can\'t be empty').notEmpty(),
    check('features', 'Feature attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  roleController.create,
);

router.put(
  '/:id',
  [
    check('name', 'Name attribute can\'t be empty').notEmpty(),
    check('templateId', 'QR Template attribute can\'t be empty').notEmpty(),
    check('features', 'Feature attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  roleController.update,
);

router.delete(
  '/:id',
  roleController.delete,
);

module.exports = router;
