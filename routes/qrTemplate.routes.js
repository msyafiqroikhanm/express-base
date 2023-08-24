const router = require('express').Router();
const templateController = require('../controllers/qrTemplate.controller');
const { uploadImage } = require('../services/multerStorage.service');

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
  templateController.create,
);

router.put(
  '/:id',
  uploadImage.single('qrTemplateImage'),
  templateController.update,
);

router.delete(
  '/:id',
  templateController.delete,
);

module.exports = router;
