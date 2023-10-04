const router = require('express').Router();
const { check } = require('express-validator');
const features = require('../../helpers/features.helper');
const Authentication = require('../../middlewares/auth.middleware');
const ValidateMiddleware = require('../../middlewares/validate.middleware');
const MenuController = require('../../controllers/menu.controller');

router.get(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_menu,
        feature.create_menu,
        feature.update_menu,
        feature.delete_menu,
      ]),
    );
  },
  MenuController.getAll,
);

router.get(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_menu,
        feature.create_menu,
        feature.update_menu,
        feature.delete_menu,
      ]),
    );
  },
  MenuController.getDetail,
);

router.post(
  '/',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.create_menu]),
    );
  },
  [
    // check('parentMenuId', 'parentMenuId attribute must be integer').isInt(),
    check('menuTypeId', 'menuTypeId attribute must be integer').isInt(),
    check('foodTypeId', 'foodTypeId attribute must be integer').isInt(),
    check('date', "date attribute can't be empty").isDate(),
    check('name', "name attribute can't be empty").notEmpty(),
    // check('quantity', 'quantity attribute must be integer').isInt(),
    // check('description', "description attribute can't be empty").notEmpty(),
  ],
  ValidateMiddleware.result,
  MenuController.create,
);

router.put(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.update_menu]),
    );
  },
  MenuController.update,
);

router.delete(
  '/:id',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [feature.delete_menu]),
    );
  },
  MenuController.delete,
);
module.exports = router;
