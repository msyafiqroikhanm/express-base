const router = require('express').Router();
const { check } = require('express-validator');
const qrController = require('../controllers/qr.controller');
const ValidateMiddleware = require('../middlewares/validate.middleware');

router.get(
  '/',
  qrController.getAll,
);

router.get(
  '/:id',
  qrController.getDetail,
);

router.post(
  '/',
  [
    check('templateId', 'Template Id attribute can\'t be empty').notEmpty(),
    check('typeId', 'Type Id attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  qrController.create,
);

router.put(
  '/:id',
  [
    check('templateId', 'Template Id attribute can\'t be empty').notEmpty(),
    check('typeId', 'Type Id attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  qrController.update,
);

router.delete(
  '/:id',
  qrController.delete,
);

module.exports = router;
