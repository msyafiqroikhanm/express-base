const ResponseFormatter = require('../helpers/responseFormatter.helper');
const rolesLib = require('../libraries/roles.lib');
const {
  selectAllRooms,
  selectRoom,
  validateRoomInputs,
  createRoom,
  updateRoom,
  deleteRoom,
} = require('../services/room.service');

class RoomController {
  static async getAll(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const where = {};
      if (req.user.Role.id !== rolesLib.superAdmin) {
        where.picId = req.user.PIC.id;
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
      if (req.user.Role.id !== rolesLib.superAdmin) {
        where.picId = req.user.PIC.id;
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

      req.body.picId = req.user.PIC.id;
      const inputs = await validateRoomInputs(req.body);
      if (!inputs.isValid && inputs.code === 404) {
        return ResponseFormatter.error404(res, 'Data Not Found', inputs.message);
      }

      const data = await createRoom(inputs.form);
      return ResponseFormatter.success201(res, data.message, data.content);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;

      const data = await updateRoom(req.params.id, req.body);
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

      const data = await deleteRoom(req.params.id);
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
