const bcryptjs = require('bcryptjs');
const ResponseFormatter = require('../helpers/responseFormatter.helper');
const { selectUser, updateUserLogin } = require('../services/user.service');
const { generateJwt } = require('../services/login.service');

class AuthController {
  static async login(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;
      const user = await selectUser({
        email: req.body.email, username: req.body.user,
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
      console.log(JSON.stringify(user, null, 2));
      return ResponseFormatter.success(res, 200, 'OK', message, {
        name: user.participant.name,
        role: user.Role.name,
        access_token: `Bearer ${access_token}`,
        modules: user.Role.modules,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
