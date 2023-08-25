const router = require('express').Router();
const { check, param } = require('express-validator');
const qrController = require('../../controllers/qr.controller');
const ValidateMiddleware = require('../../middlewares/validate.middleware');

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
  ],
  ValidateMiddleware.result,
  qrController.create,
);

router.put(
  '/:id',
  [
    param('id', 'Template Id attribute can\'t be empty').notEmpty(),
    check('templateId', 'Template Id attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  qrController.update,
);

router.delete(
  '/:id',
  qrController.delete,
);

module.exports = router;
