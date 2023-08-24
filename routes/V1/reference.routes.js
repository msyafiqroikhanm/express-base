const router = require('express').Router();
const { check } = require('express-validator');
const { SysConfigCategory, QrType } = require('../../controllers/reference.controller');
const ValidateMiddleware = require('../../middlewares/validate.middleware');

router.get(
  '/config-categories',
  SysConfigCategory.getAll,
);

router.post(
  '/config-categories/add',
  [
    check('name', 'Name attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  SysConfigCategory.create,
);

router.put(
  '/config-categories/:id',
  [
    check('name', 'Name attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  SysConfigCategory.update,
);

router.delete(
  '/config-categories/:id',
  SysConfigCategory.delete,
);

router.get(
  '/config-categories/:id',
  SysConfigCategory.getDetail,
);

router.get(
  '/qr-types',
  QrType.getAll,
);

router.post(
  '/qr-types',
  [
    check('name', 'Name attribute can\'t be empty').notEmpty(),
    check('label', 'Label attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  QrType.create,
);

router.put(
  '/qr-types/:id',
  [
    check('name', 'Name attribute can\'t be empty').notEmpty(),
    check('label', 'Label attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  QrType.update,
);

router.delete(
  '/qr-types/:id',
  QrType.delete,
);

router.get(
  '/qr-types/:id',
  QrType.getDetail,
);

module.exports = router;
