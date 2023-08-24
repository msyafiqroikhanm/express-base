const { check } = require('express-validator');
const router = require('express').Router();
const templateController = require('../../controllers/qrTemplate.controller');
const { uploadImage } = require('../../services/multerStorage.service');
const ValidateMiddleware = require('../../middlewares/validate.middleware');

router.get(
  '/',
  templateController.getAll,
);

router.get(
  '/:id',
  templateController.getDetail,
);

router.post(
  '/',
  uploadImage.single('qrTemplateImage'),
  [
    check('name', 'Name attribute can\'t be empty').notEmpty(),
    check('xCoordinate', 'xCoordinate attribute can\'t be empty').notEmpty(),
    check('yCoordinate', 'yCoordinate attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.resultWithMandatoryFile,
  templateController.create,
);

router.put(
  '/:id',
  uploadImage.single('qrTemplateImage'),
  [
    check('name', 'Name attribute can\'t be empty').notEmpty(),
    check('xCoordinate', 'xCoordinate attribute can\'t be empty').notEmpty(),
    check('yCoordinate', 'yCoordinate attribute can\'t be empty').notEmpty(),
  ],
  ValidateMiddleware.resultWithMandatoryFile,
  templateController.update,
);

router.delete(
  '/:id',
  templateController.delete,
);

module.exports = router;
