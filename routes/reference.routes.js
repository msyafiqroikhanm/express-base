const router = require('express').Router();
const { check } = require('express-validator');
const { SysConfigCategory } = require('../controllers/reference.controller');
const ValidateMiddleware = require('../middlewares/validate.middleware');

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

router.get(
  '/config-categories/:id',
  SysConfigCategory.getDetail,
);

module.exports = router;
