const router = require('express').Router();
const { check } = require('express-validator');
const configController = require('../../controllers/sysConfiguration.controller');
const ValidateMiddleware = require('../../middlewares/validate.middleware');

router.get(
  '/',
  configController.getAll,
);

router.get(
  '/:id',
  configController.getDetail,
);

router.post(
  '/',
  [
    check('categoryId', 'Category attribute can\'t be empty').notEmpty(),
    check('name', 'Name attribute can\'t be empty').notEmpty(),
    check('value', 'Value attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  configController.create,
);

router.put(
  '/:id',
  [
    check('categoryId', 'Category attribute can\'t be empty').notEmpty(),
    check('name', 'Name attribute can\'t be empty').notEmpty(),
    check('value', 'Value attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.result,
  configController.update,
);

router.delete(
  '/:id',
  configController.delete,
);

module.exports = router;
