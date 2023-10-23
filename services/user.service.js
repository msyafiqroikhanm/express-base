/* eslint-disable prefer-const */
/* eslint-disable no-param-reassign */
const { relative } = require('path');
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
  USR_PIC,
  REF_PICType,
  REF_CommitteeType,
} = require('../models');
const { createQR, updateQR } = require('./qr.service');
const { parsingUserModules } = require('../helpers/parsing.helper');
const { renameParticipantFile } = require('./participant.service');
const deleteFile = require('../helpers/deleteFile.helper');

const selectAllUsers = async (query) => {
  // parsing query
  let limitation = null;
  if (query && query.isCommittee === 'false') {
    const participantRole = await USR_Role.findOne({
      where: { name: 'Participant' },
      attributes: ['id'],
    });
    const participantCoordRole = await USR_Role.findOne({
      where: { name: 'Participant Coordinator' },
      attributes: ['id'],
    });
    limitation = { [Op.in]: [participantRole?.id, participantCoordRole?.id] };
  } else if (query && query.isCommittee === 'true') {
    const participantRole = await USR_Role.findOne({
      where: { name: 'Participant' },
      attributes: ['id'],
    });
    const participantCoordRole = await USR_Role.findOne({
      where: { name: 'Participant Coordinator' },
      attributes: ['id'],
    });
    limitation = { [Op.notIn]: [participantRole?.id, participantCoordRole?.id] };
  }

  const users = await USR_User.findAll({
    attributes: { exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'] },
    order: [['username', 'ASC']],
    include: [
      {
        model: USR_Role,
        as: 'Role',
        attributes: ['id', 'name', 'isAdministrative'],
        where: limitation ? { id: limitation } : null,
      },
      {
        model: QRM_QR,
        as: 'Qr',
        attributes: ['code'],
      },
      {
        model: PAR_Participant,
        as: 'participant',
        attributes: ['name', 'identityNo', 'gender', 'birthDate', 'phoneNbr', 'address', 'file'],
        required: true,
        include: [
          { model: PAR_Contingent, as: 'contingent', attributes: ['name'] },
          { model: REF_ParticipantType, as: 'participantType', attributes: ['name'] },
          { model: REF_IdentityType, as: 'identityType', attributes: ['name'] },
        ],
      },
    ],
  });

  users.forEach((user) => {
    user.dataValues.qrCode = user.Qr?.dataValues.code || null;
    user.dataValues.role = user.Role?.dataValues.name || null;
    user.dataValues.isAdministrative = user.Role?.dataValues.isAdministrative || null;
    if (user.participant) {
      user.participant.dataValues.contingent = user.participant.contingent?.dataValues.name || null;
      user.participant.dataValues.participantType = user.participant.participantType
        ?.dataValues.name;
      user.participant.dataValues.identityType = user.participant.identityType?.dataValues.name;
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
        attributes: ['name', 'isAdministrative'],
      },
      {
        model: QRM_QR,
        as: 'Qr',
        attributes: ['code'],
      },
      {
        model: PAR_Participant,
        as: 'participant',
        attributes: [
          'name',
          'contingentId',
          'identityTypeId',
          'identityNo',
          'gender',
          'birthDate',
          'email',
          'phoneNbr',
          'address',
          'file',
          'identityFile',
          'baptismFile',
          'referenceFile',
        ],
        required: true,
        include: [
          { model: PAR_Contingent, as: 'contingent', attributes: ['name'] },
          { model: REF_IdentityType, as: 'identityType', attributes: ['name'] },
          { model: REF_ParticipantType, as: 'participantType', attributes: ['name'] },
          { model: REF_CommitteeType, as: 'committeeType', attributes: ['name'] },
        ],
      },
    ],
  });
  if (!userInstance) {
    const error = { success: false, message: ['User Data Not Found'] };
    return error;
  }

  userInstance.dataValues.qrCode = userInstance.Qr?.dataValues.code || null;
  userInstance.dataValues.role = userInstance.Role?.dataValues.name || null;
  userInstance.dataValues.isAdministrative = userInstance.Role?.dataValues.isAdministrative || null;

  if (userInstance.participant) {
    userInstance.participant.dataValues.contingent = userInstance.participant.contingent
      ?.dataValues.name || null;
    userInstance.participant.dataValues.participantType = userInstance.participant.participantType
      ?.dataValues.name || null;
    userInstance.participant.dataValues.committeeType = userInstance.participant.committeeType
      ?.dataValues.name || null;
    userInstance.participant.dataValues.identityType = userInstance.participant.identityType
      ?.dataValues.name || null;
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

  let { email } = form;
  if (!id) {
    // check if participant already have user account for create user
    if (participantInstance?.user) {
      invalid400.push('User Account Already Exists for Participant');
    }

    const duplicateUser = await USR_User.findOne({ where: { username: form.username } });
    if (duplicateUser) {
      invalid400.push('Username already taken');
    }

    //! disable duplicate email check
    // const duplicateEmail = await USR_User.findOne({ where: { email: form.email } });
    // if (duplicateEmail) {
    //   invalid400.push('Email already taken');
    // }
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

    if (!form.email) {
      email = duplicateUser.email;
    }

    //! disable duplicate email check
    // const duplicateEmail = await USR_User.findOne({ where: { email: form.email } });
    // if (duplicateEmail) {
    //   invalid400.push('Email already taken');
    // }
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
      email,
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
        attributes: ['name', 'isAdministrative'],
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
        attributes: ['id', 'name'],
        required: true,
      },
      {
        model: USR_PIC,
        as: 'PIC',
        attributes: ['id', 'userId', 'typeId'],
        include: { model: REF_PICType, attributes: { exclude: ['createdAt', 'updatedAt'] } },
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

const validatePublicRegisterUserInputs = async (form) => {
  const invalid404 = [];
  const invalid400 = [];

  const roleInstance = await USR_Role.findOne({ where: { name: 'Participant' } });

  const participantInstance = await PAR_Participant.findOne({
    where: {
      contingentId: { [Op.ne]: null },
      [Op.and]: [
        { phoneNbr: form.phoneNbr },
        { [Op.and]: [{ identityTypeId: form.identityType || null, identityNo: form.identityNo }] },
      ],
    },
    include: { model: USR_User, as: 'user' },
  });
  // if (form.phoneNbr) {
  //   participantInstance = await PAR_Participant.findOne({
  //     where: {
  //       phoneNbr: form.phoneNbr,
  //       contingentId: { [Op.ne]: null },
  //     },
  //   });
  // } else if (form.identityType && form.identityNo) {
  //   participantInstance = await PAR_Participant.findOne({
  //     where: {
  //       identityTypeId: form.identityType || null,
  //       identityNo: form.identityNo,
  //       contingentId: { [Op.ne]: null },
  //     },
  //   });
  // }
  if (!participantInstance) {
    invalid404.push("Participant Doesn't Exist In Database / System");
  }

  // check if participant already has user
  if (participantInstance?.user) {
    invalid400.push('User Account Already Exists for Participant');
  }

  if (form.password !== form.rePassword) {
    invalid400.push('Password and New Verify-Password Do Not Match');
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

const validateProfileInputs = async (form, id, files) => {
  const {
    identityTypeId, name, gender, birthDate, identityNo, email, phoneNbr, address,
  } = form;

  const invalid400 = [];
  const invalid404 = [];

  // check identity type id validity
  const identityTypeInstance = await REF_IdentityType.findByPk(identityTypeId);
  if (!identityTypeInstance) {
    invalid404.push('Identity Type Data Not Found');
  }

  let filePath = null;
  let identityFilePath = null;
  let baptismFilePath = null;
  let referenceFilePath = null;
  if (files) {
    Object.values(files).forEach(async (file) => {
      if (file[0].fieldname === 'participantImage') {
        if (!['png', 'jpeg', 'jpg'].includes(file[0].originalname.split('.').pop())) {
          invalid400.push('Upload only supports file types [png, jpeg, and jpg]');
        }

        const maxSizeInByte = 3000000;
        if (file[0].size > maxSizeInByte) {
          invalid400.push('The file size exceeds the maximum size limit of 3 Megabyte');
        }

        filePath = `public/images/participants/${file[0].filename}`;
      } else {
        if (
          !['png', 'jpeg', 'jpg', 'pdf', 'docx'].includes(file[0].originalname.split('.').pop())
        ) {
          invalid400.push('Upload only supports file types [png, jpeg, jpg, pdf, and docx]');
        }

        let format = 'images';
        if (['pdf', 'docx'].includes(file[0].originalname.split('.').pop())) {
          format = 'documents';
        }

        const maxSizeInByte = 3000000;
        if (file[0].size > maxSizeInByte) {
          invalid400.push('The file size exceeds the maximum size limit of 3 Megabyte');
        }

        if (file[0].fieldname === 'identityFile') {
          identityFilePath = `private/${format}/identitys/${file[0].filename}`;
        }
        if (file[0].fieldname === 'baptismFile') {
          baptismFilePath = `private/${format}/baptisms/${file[0].filename}`;
        }
        if (file[0].fieldname === 'referenceFile') {
          referenceFilePath = `private/${format}/references/${file[0].filename}`;
        }
      }
    });
  }

  const userInstance = await USR_User.findOne({
    where: { id },
    attributes: ['participantId'],
  });

  // check identity number duplicate
  const isDuplicateIdentityNo = await PAR_Participant.findOne({
    where: userInstance
      ? { id: { [Op.ne]: userInstance.participantId }, identityNo, identityTypeId }
      : { identityNo, identityTypeId },
  });
  if (isDuplicateIdentityNo) {
    invalid400.push(`Identity Number ${identityNo} Already Used In System`);
  }

  // check phone number duplicate
  const isDuplicatePhoneNbr = await PAR_Participant.findOne({
    where: userInstance ? { id: { [Op.ne]: userInstance.participantId }, phoneNbr } : { phoneNbr },
  });
  if (isDuplicatePhoneNbr) {
    invalid400.push(`Phone Number ${phoneNbr} Already Used In System`);
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
      identityType: identityTypeInstance,
      name,
      gender,
      birthDate: new Date(birthDate),
      identityNo,
      email,
      phoneNbr,
      address,
      file: filePath,
      identityFile: identityFilePath,
      baptismFile: baptismFilePath,
      referenceFile: referenceFilePath,
    },
  };
};

const updateUserProfile = async (form, id) => {
  const userInstance = await USR_User.findByPk(id);
  if (!userInstance) {
    return {
      success: false,
      code: 404,
      message: ['User Data Not Found'],
    };
  }

  const participantInstance = await PAR_Participant.findOne({
    where: { id: userInstance.participantId },
    attributes: { exclude: ['contingentId', 'qrId', 'typeId', 'committeeTypeId'] },
  });
  if (!participantInstance) {
    return {
      success: false,
      code: 404,
      message: ['User Data Not Found'],
    };
  }

  // update user data
  userInstance.email = form.email || userInstance.email;

  // delete old file when user want to change it
  if (form.file && participantInstance.file) {
    console.log('deleting photo participant');
    await deleteFile(relative(__dirname, participantInstance.file));
  }
  if (form.identityFile && participantInstance.identityFile) {
    console.log('deleting identity participant');
    await deleteFile(relative(__dirname, participantInstance.identityFile));
  }
  if (form.baptismFile && participantInstance.baptismFile) {
    console.log('deleting baptism participant');
    await deleteFile(relative(__dirname, participantInstance.baptismFile));
  }
  if (form.referenceFile && participantInstance.referenceFile) {
    console.log('deleting reference participant');
    await deleteFile(relative(__dirname, participantInstance.referenceFile));
  }

  participantInstance.file = form.file || participantInstance.file;
  participantInstance.identityFile = form.identityFile || participantInstance.identityFile;
  participantInstance.baptismFile = form.baptismFile || participantInstance.baptismFile;
  participantInstance.referenceFile = form.referenceFile || participantInstance.referenceFile;

  // check if participant doesn't change the files but changing phone number
  if (participantInstance.phoneNbr !== form.phoneNbr || participantInstance.name !== form.name) {
    if (participantInstance.file && !form.file) {
      participantInstance.file = await renameParticipantFile(
        participantInstance.file,
        form.name,
        form.phoneNbr,
      );
    }
    if (participantInstance.identityFile && !form.identityFile) {
      participantInstance.identityFile = await renameParticipantFile(
        participantInstance.identityFile,
        form.name,
        form.phoneNbr,
      );
    }
    if (participantInstance.baptismFile && !form.baptismFile) {
      participantInstance.baptismFile = await renameParticipantFile(
        participantInstance.baptismFile,
        form.name,
        form.phoneNbr,
      );
    }
    if (participantInstance.referenceFile && !form.referenceFile) {
      participantInstance.referenceFile = await renameParticipantFile(
        participantInstance.referenceFile,
        form.name,
        form.phoneNbr,
      );
    }
  }

  participantInstance.identityTypeId = form.identityType?.id || participantInstance.identityTypeId;
  participantInstance.name = form.name || participantInstance.name;
  participantInstance.gender = form.gender || participantInstance.gender;
  participantInstance.birthDate = form.birthDate || participantInstance.birthDate;
  participantInstance.identityNo = form.identityNo || participantInstance.identityNo;
  participantInstance.email = form.email || participantInstance.email;
  participantInstance.phoneNbr = form.phoneNbr || participantInstance.phoneNbr;
  participantInstance.address = form.address || participantInstance.address;

  await participantInstance.save();
  await userInstance.save();

  return {
    success: true,
    message: 'User Profile Successfully Updated',
    content: participantInstance,
  };
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
  validatePublicRegisterUserInputs,
  validateProfileInputs,
  updateUserProfile,
};
