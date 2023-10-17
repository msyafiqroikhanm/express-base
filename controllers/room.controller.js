const { Op } = require('sequelize');
const ResponseFormatter = require('../helpers/responseFormatter.helper');
const {
  selectAllRooms,
  selectRoom,
  validateRoomInputs,
  createRoom,
  updateRoom,
  deleteRoom,
} = require('../services/room.service');
const { createNotifications } = require('../services/notification.service');

class RoomController {
  static async getAll(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      // console.log(JSON.stringify(req.user.limitation, null, 2));
      const where = {};
      if (!req.user.limitation.isAdmin) {
        where.locationId = {
          [Op.or]: req.user.limitation.access.location,
        };
      }
      if (req.query) {
        if (req.query.locationId) {
          where.locationId = req.query.locationId;
        }
        if (req.query.typeId) {
          where.typeId = req.query.typeId;
        }
        if (req.query.bedId) {
          where.bedId = req.query.bedId;
        }
        if (req.query.statusId) {
          where.statusId = req.query.statusId;
        }
      }

      const data = await selectAllRooms(where);
      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async getDetail(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const where = { id: req.params.id };
      if (!req.user.limitation.isAdmin) {
        where.locationId = {
          [Op.or]: req.user.limitation.access.location,
        };
      }

      const data = await selectRoom(where);
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

      const where = { id: req.body.locationId };
      if (!req.user.limitation.isAdmin) {
        where.picId = req.user.limitation.access.picId;
      }

      const inputs = await validateRoomInputs(req.body, where);
      if (!inputs.isValid && inputs.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', inputs.message);
      }
      if (!inputs.isValid && inputs.code === 400) {
        return ResponseFormatter.error400(res, 'Bad Request', inputs.message);
      }

      const data = await createRoom(inputs.form);

      const io = req.app.get('socketIo');
      await createNotifications(
        io,
        'Room Created',
        data.content.id,
        [data.content.name, data.content.location],
      );
      return ResponseFormatter.success201(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const where = { id: req.params.id };
      if (!req.user.limitation.isAdmin) {
        where.locationId = {
          [Op.or]: req.user.limitation.access.location,
        };
      }

      const data = await updateRoom(where, req.body);
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

      const where = { id: req.params.id };
      if (!req.user.limitation.isAdmin) {
        where.locationId = {
          [Op.or]: req.user.limitation.access.location,
        };
      }

      const data = await deleteRoom(where);
      if (!data.success) {
        return ResponseFormatter.error404(res, 'Data Not Found', data.message);
      }
      return ResponseFormatter.success200(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = RoomController;
