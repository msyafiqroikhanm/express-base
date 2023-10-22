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
  checkinLodger,
  checkoutLodger,
} = require('../services/lodger.service');
const { createNotifications } = require('../services/notification.service');

class LodgerController {
  static async getAll(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      // console.log(JSON.stringify(req.user, null, 2));
      const where = {};
      if (req.query?.contingentId) {
        where.contingentId = req.query.contingentId;
      }
      if (req.query?.locationId) {
        where.locationId = req.query.locationId;
      }
      if (!req.user.limitation.isAdmin) {
        if (req.query?.locationId) {
          const filter = req.user.limitation.access.location.includes(Number(req.query.locationId));
          if (filter) {
            where.locationId = req.query.locationId;
          }
        } else {
          where.locationId = { [Op.or]: req.user.limitation.access.location };
        }

        if (req.query?.contingentId) {
          if (req.user.participant.contingentId === req.query.contingentId) {
            where.contingentId = req.query.contingentId;
          }
        } else {
          where.contingentId = req.user.participant.contingentId || null;
        }
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
      if (!inputs.isValid && inputs.code === 400) {
        return ResponseFormatter.error400(res, 'Bad Request', inputs.message);
      }

      // console.log(inputs.form);
      const data = await createLodger(inputs.form);

      const io = req.app.get('socketIo');
      await createNotifications(io, 'Lodger Created', data.content.id, [
        data.content.reservationIn,
        data.content.location,
      ]);

      return ResponseFormatter.success201(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const data = await updateLodger(req.params.id, req.body);
      if (!data.success && data.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }
      if (!data.success && data.code === 400) {
        return ResponseFormatter.error400(res, 'Bad Request', data.message);
      }

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async checkin(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const data = await checkinLodger(req.params.id, req.body);
      if (!data.success && data.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }
      if (!data.success && data.code === 400) {
        return ResponseFormatter.error400(res, 'Bad Request', data.message);
      }

      const io = req.app.get('socketIo');
      await createNotifications(io, 'Check In', data.content.id, [
        data.content.participant,
        data.content.checkIn,
        data.content.id,
      ]);

      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async checkout(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const data = await checkoutLodger(req.params.id, req.body);
      if (!data.success && data.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }
      if (!data.success && data.code === 400) {
        return ResponseFormatter.error400(res, 'Bad Request', data.message);
      }

      const io = req.app.get('socketIo');
      await createNotifications(io, 'Check Out', data.content.id, [
        data.content.participant,
        data.content.checkOut,
        data.content.id,
      ]);

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
