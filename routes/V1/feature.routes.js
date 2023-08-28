const router = require('express').Router();
const { check } = require('express-validator');
const featureController = require('../../controllers/feature.controller');
const ValidateMiddleware = require('../../middlewares/validate.middleware');

router.get(
  '/',
  featureController.getAll,
);

router.get(
  '/:id',
  featureController.getDetail,
);

router.post(
  '/',
  [
    check('moduleId', 'moduleId attribute can\'t be empty').notEmpty(),
    check('name', 'Name attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  featureController.create,
);

router.put(
  '/:id',
  [
    check('moduleId', 'moduleId attribute can\'t be empty').notEmpty(),
    check('name', 'Name attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  featureController.update,
);

router.delete(
  '/:id',
  featureController.delete,
);

module.exports = router;
