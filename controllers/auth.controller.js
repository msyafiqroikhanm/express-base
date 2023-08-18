const { Op } = require('sequelize');
const bcryptjs = require('bcryptjs');
const ResponseFormatter = require('../helpers/responseFormatter.helper');
const { selectDetailUser, updateUser } = require('../services/user.service');
const { generateJwt } = require('../services/login.service');

class AuthController {
  static async login(req, res, next) {
    try {
      res.url = `${req.method} ${req.originalUrl}`;
      const user = await selectDetailUser({
        [Op.or]: { email: req.body.user, username: req.body.user },
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

      await updateUser({ id: user.id }, { lastLogin: new Date() });
      console.log(user);
      const message = 'Berhasil Login';
      return ResponseFormatter.success(res, 200, 'OK', message, {
        name: user.name,
        role: user.Role.name,
        access_token: `Bearer ${access_token}`,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
