const bcryptjs = require('bcryptjs');
const ResponseFormatter = require('../helpers/responseFormatter.helper');
const { selectUser, updateUserLogin } = require('../services/user.service');
const { generateJwt } = require('../services/login.service');

class AuthController {
  static async login(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;
      res.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

      const user = await selectUser({
        // email: req.body.user,
        username: req.body.user,
      });

      if (!user) {
        return ResponseFormatter.error401(res, 'Invalid user or password');
      }

      if (!bcryptjs.compareSync(req.body.password, user.password)) {
        return ResponseFormatter.error401(res, 'Invalid user or password');
      }

      const payload = {
        userId: user.id,
        roleId: user.roleId,
      };
      const access_token = await generateJwt(payload);

      await updateUserLogin({ id: user.id }, { lastLogin: new Date() });
      const message = 'Berhasil Login';
      return ResponseFormatter.success200(res, message, {
        id: user.id,
        participantId: user.participant.id,
        name: user.participant.name,
        role: user.Role.name,
        isAdministrative: user.Role.isAdministrative,
        access_token: `Bearer ${access_token}`,
        PIC: user.PIC,
        modules: user.Role.modules,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
