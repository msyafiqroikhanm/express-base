const router = require('express').Router();
const { check } = require('express-validator');
const moduleController = require('../../controllers/module.controller');
const ValidateMiddleware = require('../../middlewares/validate.middleware');

router.get(
  '/',
  moduleController.getAll,
);

router.get(
  '/:id',
  moduleController.getDetail,
);

router.post(
  '/',
  [
    check('name', 'Name attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  moduleController.create,
);

router.put(
  '/:id',
  [
    check('name', 'Name attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  moduleController.update,
);

router.delete(
  '/:id',
  moduleController.delete,
);

module.exports = router;
