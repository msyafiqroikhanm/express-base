const router = require('express').Router();
const features = require('../../helpers/features.helper');
const Authentication = require('../../middlewares/auth.middleware');
const ReportController = require('../../controllers/report.controller');

router.get(
  '/transportation',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_transportation_report,
      ]),
    );
  },
  Authentication.transportation,
  ReportController.getTransportationReport,
);

router.get(
  '/event',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_event_report,
      ]),
    );
  },
  Authentication.event,
  ReportController.getEventReport,
);

router.get(
  '/participant',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_participant_report,
      ]),
    );
  },
  Authentication.participant,
  ReportController.getParticipantReport,
);

router.get(
  '/accomodation',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_accomodation_report,
      ]),
    );
  },
  Authentication.accomodation,
  ReportController.getAccomodationReport,
);

router.get(
  '/fnb',
  async (req, res, next) => {
    Authentication.authenticate(
      req,
      res,
      next,
      await features().then((feature) => [
        feature.view_fnb_report,
      ]),
    );
  },
  ReportController.getFnBReport,
);

module.exports = router;
