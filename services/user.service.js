const { USR_User, USR_Role } = require('../models');

const selectDetailUser = async (where) => {
  const user = await USR_User.findOne({
    where,
    include: {
      model: USR_Role,
      as: 'Role',
    },
  });
  return user;
};

module.exports = { selectDetailUser };
