/* eslint-disable no-param-reassign */
const fs = require('fs/promises');
const { relative } = require('path');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const {
  USR_User, USR_Role, QRM_QR, QRM_QRTemplate,
} = require('../models');
const { createQR, updateQR } = require('./qr.service');
const deleteFile = require('../helpers/deleteFile.helper');

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
    ],
  });

  users.forEach((user) => {
    user.dataValues.qrCode = user.Qr.dataValues.code;
    user.dataValues.role = user.Role.dataValues.name;
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
    ],
  });
  if (!userInstance) {
    const error = { success: false, message: 'User Data Not Found' };
    return error;
  }

  userInstance.dataValues.qrCode = userInstance.Qr.dataValues.code;
  userInstance.dataValues.role = userInstance.Role.dataValues.name;
  delete userInstance.dataValues.Qr;
  delete userInstance.dataValues.Role;

  return { success: true, message: 'Successfully Getting User', content: userInstance };
};

const validateUserInputs = async (form, file) => {
  const roleInstance = await USR_Role.findByPk(form.roleId);
  if (!roleInstance) {
    return { isValid: false, code: 404, message: 'Role Data Not Found' };
  }

  if (!file) {
    return { isValid: false, code: 400, message: 'User Image File Not Found' };
  }

  if (!['png', 'jpeg', 'jpg'].includes(file.originalname.split('.')[1])) {
    const error = { isValid: false, code: 400, message: 'Upload only supports file types [png and jpeg]' };
    return error;
  }

  const imageBuffer = await fs.readFile(file.path);
  const maxSizeInByte = 2000000;
  if (imageBuffer.length > maxSizeInByte) {
    return { isValid: false, code: 400, message: 'The file size exceeds the maximum size limit of 2 Megabyte' };
  }

  return {
    isValid: true,
    form: {
      roleId: roleInstance.id,
      name: form.name,
      username: form.username,
      password: form.password,
      email: form.email,
      phoneNbr: form.phoneNbr,
      file: `public/images/users/${file.filename}`,
    },
  };
};

const createUser = async (form) => {
  const roleInstance = await USR_Role.findByPk(form.roleId);
  const qr = await createQR({ templateId: roleInstance.templateId }, { rawFile: `public/images/qrs/qrs-${Date.now()}.png`, combineFile: `public/images/qrCombines/combines-${Date.now()}.png` });
  const userInstance = await USR_User.create({
    qrId: qr.content.id,
    roleId: form.roleId,
    name: form.name,
    username: form.username,
    password: form.password,
    email: form.email,
    phoneNbr: form.phoneNbr,
    file: form.file,
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
      success: false, code: 404, message: 'User Data Not Found',
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

  // delete old file
  await deleteFile(relative(__dirname, userInstance.file));

  userInstance.qrId = form.qrId;
  userInstance.roleId = form.roleId;
  userInstance.name = form.name;
  userInstance.email = form.email;
  userInstance.phoneNbr = form.phoneNbr;
  userInstance.file = form.file;
  await userInstance.save();

  return { success: true, message: 'User Successfully Updated', content: userInstance };
};

const deleteUser = async (id) => {
  // check user id validity
  const userInstance = await USR_User.findByPk(id);
  if (!userInstance) {
    const error = { success: false, code: 404, message: 'User Data Not Found' };
    return error;
  }

  const { name } = userInstance.dataValues;

  // delete the qr type after passsing the check
  await userInstance.destroy();

  return {
    success: true,
    message: 'User Successfully Deleted',
    content: `User ${name} Successfully Deleted`,
  };
};

const validatePasswordInputs = async (id, form) => {
  // check validity of user id
  const userInstance = await USR_User.findByPk(id);
  if (!userInstance) {
    return { isValid: false, code: 404, message: 'User Data Not Found' };
  }

  if (form.newPassword !== form.newRePassword) {
    return { isValid: false, code: 400, message: 'New Password and New Re-Password Do Not Match' };
  }

  const comparePassword = await bcrypt.compare(form.oldPassword, userInstance.password);
  if (!comparePassword) {
    return { isValid: false, code: 400, message: 'Old password is incorrect' };
  }

  if (form.oldPassword === form.newPassword) {
    return { isValid: false, code: 400, message: 'New Password Cannot Be Same As Old Password' };
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
    include: { model: USR_Role, attributes: ['name'], as: 'Role' },
    [Op.or]: query,
  });
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
