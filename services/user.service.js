/* eslint-disable no-param-reassign */
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const {
  USR_User,
  USR_Role,
  QRM_QR,
  QRM_QRTemplate,
  PAR_Participant,
  USR_Feature,
  REF_IdentityType,
  PAR_Contingent,
  REF_ParticipantType,
  USR_Module,
} = require('../models');
const { createQR, updateQR } = require('./qr.service');
const { parsingUserModules } = require('../helpers/parsing.helper');

const selectAllUsers = async () => {
  const users = await USR_User.findAll({
    attributes: { exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'] },
    include: [
      {
        model: USR_Role,
        as: 'Role',
      },
      {
        model: QRM_QR,
        as: 'Qr',
      },
      {
        model: PAR_Participant,
        as: 'participant',
        attributes: ['name', 'identityNo', 'gender', 'birthDate', 'phoneNbr', 'address', 'file'],
        include: [
          { model: PAR_Contingent, as: 'contingent', attributes: ['name'] },
          { model: REF_ParticipantType, as: 'participantType', attributes: ['name'] },
          { model: REF_IdentityType, as: 'identityType', attributes: ['name'] },
        ],
      },
    ],
  });

  users.forEach((user) => {
    user.dataValues.qrCode = user.Qr?.dataValues.code;
    user.dataValues.role = user.Role?.dataValues.name;
    if (user.participant) {
      user.participant.dataValues.contingent = user.participant.contingent
        ?.dataValues.name || null;
      user.participant.dataValues.participantType = user.participant.participantType
        ?.dataValues.name;
      user.participant.dataValues.identityType = user.participant.identityType
        ?.dataValues.name;
    }
    delete user.dataValues.Qr;
    delete user.dataValues.Role;
  });

  return { success: true, message: 'Successfully Getting All Users', content: users };
};

const selectDetailUser = async (id) => {
  const userInstance = await USR_User.findByPk(id, {
    attributes: { exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'] },
    include: [
      {
        model: USR_Role,
        as: 'Role',
      },
      {
        model: QRM_QR,
        as: 'Qr',
      },
      {
        model: PAR_Participant,
        as: 'participant',
        attributes: ['name', 'identityNo', 'gender', 'birthDate', 'phoneNbr', 'address', 'file'],
        include: [
          { model: PAR_Contingent, as: 'contingent', attributes: ['name'] },
          { model: REF_ParticipantType, as: 'participantType', attributes: ['name'] },
          { model: REF_IdentityType, as: 'identityType', attributes: ['name'] },
        ],
      },
    ],
  });
  if (!userInstance) {
    const error = { success: false, message: ['User Data Not Found'] };
    return error;
  }

  userInstance.dataValues.qrCode = userInstance.Qr?.dataValues.code;
  userInstance.dataValues.role = userInstance.Role?.dataValues.name;

  if (userInstance.participant) {
    userInstance.participant.dataValues.contingent = userInstance.participant.contingent
      ?.dataValues.name || null;
    userInstance.participant.dataValues.participantType = userInstance.participant.participantType
      ?.dataValues.name;
    userInstance.participant.dataValues.identityType = userInstance.participant.identityType
      ?.dataValues.name;
  }
  delete userInstance.dataValues.Qr;
  delete userInstance.dataValues.Role;

  return { success: true, message: 'Successfully Getting User', content: userInstance };
};

const validateUserInputs = async (form, id) => {
  const invalid404 = [];
  const invalid400 = [];
  const roleInstance = await USR_Role.findByPk(form.roleId);
  if (!roleInstance) {
    invalid404.push('Role Data Not Found');
  }

  const participantInstance = await PAR_Participant.findByPk(form.participantId, {
    include: { model: USR_User, as: 'user' },
  });
  if (!participantInstance) {
    invalid404.push('Participant Data Not Found');
  }

  if (!id) {
    // check if participant already have user account for create user
    if (participantInstance?.user) {
      invalid400.push('User Account Already Exists for Participant');
    }

    const duplicateUser = await USR_User.findOne({ where: { username: form.username } });
    if (duplicateUser) {
      invalid400.push('Username already taken');
    }
  } else if (participantInstance?.user && id) {
    // when updating user check if participant belongs to user before update (old data)
    if (participantInstance?.user.id !== Number(id)) {
      invalid400.push('User Account Already Exists for Participant');
    }
  } else if (id) {
    const duplicateUser = await USR_User.findOne({
      where: { id: { [Op.ne]: id }, username: form.username },
    });
    if (duplicateUser) {
      invalid400.push('Username already taken');
    }
  }

  if (invalid400.length > 0) {
    return {
      isValid: false,
      code: 400,
      message: invalid400,
    };
  }
  if (invalid404.length > 0) {
    return {
      isValid: false,
      code: 404,
      message: invalid404,
    };
  }

  return {
    isValid: true,
    form: {
      roleId: roleInstance.id,
      participantId: participantInstance.id,
      username: form.username,
      password: form.password,
      email: form.email,
    },
  };
};

const createUser = async (form) => {
  const roleInstance = await USR_Role.findByPk(form.roleId);
  const qr = await createQR(
    { templateId: roleInstance.templateId },
    {
      rawFile: `public/images/qrs/qrs-${Date.now()}.png`,
      combineFile: `public/images/qrCombines/combines-${Date.now()}.png`,
    },
  );
  const userInstance = await USR_User.create({
    qrId: qr.content.id,
    participantId: form.participantId,
    roleId: form.roleId,
    username: form.username,
    password: form.password,
    email: form.email,
  });

  delete userInstance.dataValues.password;

  return { success: true, message: 'User Successfully Created', content: userInstance };
};

const updateUser = async (id, form) => {
  // validate user id
  const userInstance = await USR_User.findByPk(id, {
    include: { model: QRM_QR, as: 'Qr' },
  });

  if (!userInstance) {
    return {
      success: false,
      code: 404,
      message: ['User Data Not Found'],
    };
  }

  // regenerate qrcode when changing user role
  if (userInstance.roleId !== form.roleId) {
    const roleInstance = await USR_Role.findByPk(form.roleId, {
      include: { model: QRM_QRTemplate, as: 'template' },
      attributes: { exclude: ['password'] },
    });
    await updateQR(
      userInstance.Qr.id,
      {
        templateId: roleInstance.template.id,
      },
      {
        rawFile: `public/images/qrs/qrs-${Date.now()}.png`,
        combineFile: `public/images/qrCombines/combines-${Date.now()}.png`,
      },
    );
  }

  userInstance.roleId = form.roleId;
  userInstance.participantId = form.participantId;
  userInstance.email = form.email;
  await userInstance.save();

  return { success: true, message: 'User Successfully Updated', content: userInstance };
};

const deleteUser = async (id) => {
  // check user id validity
  const userInstance = await USR_User.findByPk(id);
  if (!userInstance) {
    const error = { success: false, code: 404, message: ['User Data Not Found'] };
    return error;
  }

  const { name } = userInstance.dataValues;

  // delete the user after passsing the check
  await userInstance.destroy();

  return {
    success: true,
    message: 'User Successfully Deleted',
    content: `User ${name} Successfully Deleted`,
  };
};

const validatePasswordInputs = async (id, form) => {
  // check validity of user id
  const invalid404 = [];
  const invalid400 = [];
  const userInstance = await USR_User.findByPk(id);
  if (!userInstance) {
    invalid404.push('User Data Not Found');
  }

  if (form.newPassword !== form.newRePassword) {
    invalid400.push('New Password and New Re-Password Do Not Match');
  }

  const comparePassword = await bcrypt.compare(form.oldPassword, userInstance?.password);
  if (!comparePassword) {
    invalid400.push('Old password is incorrect');
  }

  if (form.oldPassword === form.newPassword) {
    invalid400.push('New Password Cannot Be Same As Old Password');
  }

  if (invalid400.length > 0) {
    return {
      isValid: false,
      code: 400,
      message: invalid400,
    };
  }
  if (invalid404.length > 0) {
    return {
      isValid: false,
      code: 404,
      message: invalid404,
    };
  }

  return {
    isValid: true,
    form: { user: userInstance, newPassword: form.newPassword, newRePassword: form.newRePassword },
  };
};

const updateUserPassword = async (form) => {
  form.user.password = form.newPassword;
  await form.user.save();

  return {
    success: true,
    message: 'User Password Successfully Updated',
    content: `User Password ${form.user.name} Successfully Updated`,
  };
};

const selectUser = async (query) => {
  const userInstance = await USR_User.findOne({
    include: [
      {
        model: USR_Role,
        attributes: ['name'],
        as: 'Role',
        include: {
          model: USR_Feature,
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          through: {
            attributes: [],
          },
          include: {
            model: USR_Module,
            attributes: ['id', 'name'],
            include: { model: USR_Module, as: 'parentModule', attributes: ['id', 'name'] },
          },
        },
      },
      {
        model: PAR_Participant,
        as: 'participant',
        attributes: ['name'],
      },
    ],
    where: {
      [Op.or]: query,
    },
  });
  if (!userInstance) {
    return null;
  }

  const result = parsingUserModules(userInstance);

  // parsing userInstance
  userInstance.Role.dataValues.modules = result;
  userInstance.Role.modules = result;
  delete userInstance.Role.dataValues.USR_Features;
  return userInstance;
};

const updateUserLogin = async (where, form) => {
  await USR_User.update(form, { where });
};

module.exports = {
  validateUserInputs,
  validatePasswordInputs,
  selectAllUsers,
  selectDetailUser,
  selectUser,
  createUser,
  updateUser,
  deleteUser,
  updateUserPassword,
  updateUserLogin,
};
