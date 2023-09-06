const router = require('express').Router();
const WebHookController = require('../../controllers/webhook.controller');

router.get(
  '/',
  WebHookController.verify,
);

router.post(
  '/',
  WebHookController.receive,
);

module.exports = router;
