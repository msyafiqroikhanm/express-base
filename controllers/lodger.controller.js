const { Op } = require('sequelize');
const ResponseFormatter = require('../helpers/responseFormatter.helper');
const {
  validateLodgerInputs,
  createLodger,
  selectAllLodgers,
  selectLodger,
  updateLodger,
  deleteLodger,
  selectAllParticipantLodger,
} = require('../services/lodger.service');

class LodgerController {
  static async getAll(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      // console.log(JSON.stringify(req.user.limitation, null, 2));
      const where = {};
      if (req.query?.contingentId) {
        where.contingentId = req.query.contingentId;
      }
      if (!req.user.limitation.isAdmin) {
        where.locationId = { [Op.or]: req.user.limitation.access.location };
      }
      const data = await selectAllLodgers(where);

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async getParticipantsWhoHaveNotReveivedAccomodation(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      // const where = {};
      // if (req.query?.contingentId) {
      //   where.contingentId = req.query.contingentId;
      // }
      // if (req.query?.isComitee) {
      //   where.contingentId = null;
      // }

      const participantLodgers = await selectAllLodgers({});
      const participantLodgerIds = await participantLodgers.content.map(
        (element) => element.participantId,
      );
      const query = { id: { [Op.notIn]: participantLodgerIds } };
      if (req.query?.contingentId) {
        query.contingentId = req.query.contingentId;
      }
      if (req.query?.isComitee) {
        query.contingentId = null;
      }
      const data = await selectAllParticipantLodger(query, {});

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async getDetail(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      // console.log(JSON.stringify(req.user.limitation, null, 2));
      const where = {};
      if (!req.user.limitation.isAdmin) {
        where.locationId = { [Op.or]: req.user.limitation.access.location };
      }
      const data = await selectLodger(req.params.id, where);
      if (!data.success) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }
      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const inputs = await validateLodgerInputs(req.body);
      if (!inputs.isValid && inputs.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', inputs.message);
      }

      console.log(inputs.form);
      const data = await createLodger(inputs.form);
      return ResponseFormatter.success201(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const data = await updateLodger(req.params.id, req.body);
      if (!data.success) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const data = await deleteLodger(req.params.id);
      if (!data.success) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = LodgerController;
