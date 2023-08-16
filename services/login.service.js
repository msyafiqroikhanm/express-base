const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { USR_User } = require('../models');

const generateJwt = async (data) => {
  const token = jwt.sign(data, process.env.JWT_PRIVATE_KEY, {
    expiresIn: process.env.JWT_EXPIRE_DURATION,
  });
  return token;
};

const verifyJwt = async (password, correctPassword) => {
  try {
    const isCorrect = await bcrypt.compare(password, correctPassword);
    return isCorrect;
  } catch (error) {
    console.error(error);
  }
};

const loginService = async (username, password) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // Get userData related to input
    const userData = await USR_User.findOne({
      where: { username },
    });

    if (!userData || username !== userData.username) {
      throw { code: 400, status: 'Unauthorized Request', message: 'Username or Password is incorrect!' };
    }

    // Check if password correct with the the hashes one in database
    // if incorrect return the same message as username incorrect
    const isCorrect = await verifyJwt(password, userData.password);
    if (!isCorrect) {
      throw { code: 400, status: 'Unauthorized Request', message: 'Username or Password is incorrect!' };
    }

    const payload = { id: userData.id, roleId: USR_User.roleId };
    const token = await generateJwt(payload);

    return {
      token: `Bearer ${token}`,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = { loginService };
