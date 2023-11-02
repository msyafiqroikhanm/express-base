/* eslint-disable no-param-reassign */
const fs = require('fs');
const { Op } = require('sequelize');
const {
  FNB_Courier,
  REF_CommitteeType,
  REF_IdentityType,
  PAR_Participant,
  USR_Role,
  USR_User,
  FNB_Schedule,
} = require('../models');
const { createUser } = require('./user.service');

const selectAllCouriers = async (where) => {
  const courierInstances = await FNB_Courier.findAll({
    where,
    order: [['name', 'ASC']],
    include: [
      {
        model: USR_User,
        as: 'user',
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
        include: {
          model: PAR_Participant,
          as: 'participant',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: [
            {
              model: REF_CommitteeType,
              as: 'committeeType',
              attributes: { exclude: ['createdAt', 'updatedAt'] },
            },
          ],
        },
      },
    ],
  });

  return {
    success: true,
    message: 'Successfully Getting All Courier',
    content: courierInstances,
  };
};

const selectCourier = async (where) => {
  const courierInstance = await FNB_Courier.findOne({
    where,
    include: [
      {
        model: USR_User,
        as: 'user',
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
        include: {
          model: PAR_Participant,
          as: 'participant',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: [
            {
              model: REF_CommitteeType,
              as: 'committeeType',
              attributes: { exclude: ['createdAt', 'updatedAt'] },
            },
          ],
        },
      },
    ],
  });
  if (!courierInstance) {
    return {
      success: false,
      message: 'Courier Data Not Found',
    };
  }

  return {
    success: true,
    message: 'Successfully Getting Detail Courier',
    content: courierInstance,
  };
};

const validateCourierInputs = async (form, file) => {
  const { identityTypeId, name, gender, birthDate, identityNo, phoneNbr, email, address } = form;

  const invalid400 = [];
  const invalid404 = [];

  // check identity type id validity
  const identityTypeInstance = await REF_IdentityType.findByPk(identityTypeId);
  if (!identityTypeInstance) {
    invalid404.push('Identity Type Data Not Found');
  }

  let filePath = null;
  if (file) {
    if (!['png', 'jpeg', 'jpg'].includes(file.originalname.split('.')[1])) {
      invalid400.push('Upload only supports file types [png, jpeg, and jpg]');
    }

    // console.log(file.path);
    const imageBuffer = fs.readFileSync(file.path);
    // console.log(imageBuffer);
    const maxSizeInByte = 2000000;
    if (imageBuffer.length > maxSizeInByte) {
      invalid400.push('The file size exceeds the maximum size limit of 2 Megabyte');
    }

    console.log(file);
    filePath = `public/images/committees/${file.filename}`;
  }

  // check identity number duplicate
  const isDuplicateIdentityNo = await PAR_Participant.findOne({ where: { identityNo } });
  if (isDuplicateIdentityNo) {
    invalid400.push(`Identity Number ${identityNo} Already Used In System`);
  }

  // check phone number duplicate
  const isDuplicatePhoneNo = await PAR_Participant.findOne({ where: { phoneNbr } });
  if (isDuplicatePhoneNo) {
    invalid400.push(`Phone Number ${phoneNbr} Already Used In System`);
  }

  const comiteeTypeFNB = await REF_CommitteeType.findOne({
    where: { name: { [Op.substring]: 'fnb' } },
  });

  //* USER VALIDATION

  const roleCourier = await USR_Role.findOne({ where: { name: { [Op.substring]: 'courier' } } });
  console.log(JSON.stringify(roleCourier, null, 2));
  const duplicateUser = await USR_User.findOne({ where: { username: form.username } });
  if (duplicateUser) {
    invalid400.push('Username already taken');
  }

  const duplicateEmail = await USR_User.findOne({ where: { email: form.email } });
  if (duplicateEmail) {
    invalid400.push('Email already taken');
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
      participant: {
        committeeTypeId: comiteeTypeFNB.id,
        identityTypeId: identityTypeInstance.id,
        name,
        gender,
        birthDate: new Date(birthDate),
        identityNo,
        phoneNbr,
        email,
        address,
        file: filePath,
      },
      user: {
        roleId: roleCourier.id,
        // participantId: participantInstance.id,
        username: form.username,
        password: form.password,
        email: form.email,
      },
      courier: {
        name: form.name,
        phoneNbr,
        isAvailable: true,
      },
    },
  };
};

const createCourier = async (form) => {
  const participantInstance = await PAR_Participant.create(form.participant);

  form.user.participantId = participantInstance.id;
  // form.user.qrId = qr.content.id;
  const userInstance = await createUser(form.user);

  form.courier.userId = userInstance.content.id;
  const courierInstance = await FNB_Courier.create(form.courier);

  return {
    success: true,
    message: 'Courier Successfully Created',
    content: courierInstance,
  };
};

const updateCourier = async (where, form) => {
  // check identity type id validity
  const courierInstance = await FNB_Courier.findOne({ where });
  if (!courierInstance) {
    return {
      success: false,
      message: 'Courier Data Not Found',
    };
  }

  const errorMessages = [];

  if (form.userId) {
    const userInstance = await USR_User.findOne({ where: { id: form.userId } });
    if (!userInstance) {
      errorMessages.push('User Data Not Found');
    }
  }
  if (errorMessages.length > 0) {
    return { isValid: false, code: 404, message: errorMessages };
  }

  courierInstance.userId = form.userId ? form.userId : courierInstance.userId;
  courierInstance.name = form.name ? form.name : courierInstance.name;
  courierInstance.phoneNbr = form.phoneNbr ? form.phoneNbr : courierInstance.phoneNbr;
  await courierInstance.save();

  return {
    success: true,
    message: 'Courier Successfully Updated',
    content: courierInstance,
  };
};

const deleteCourier = async (where) => {
  // check identity type id validity
  const courierInstance = await FNB_Courier.findOne({ where });
  if (!courierInstance) {
    return {
      success: false,
      message: 'Courier Data Not Found',
    };
  }

  let userInstance;
  let participantInstance;
  if (courierInstance.userId) {
    userInstance = await USR_User.findOne({ where: { id: courierInstance.userId } });
    participantInstance = await PAR_Participant.findOne({
      where: { id: userInstance.participantId },
    });
  }

  await FNB_Schedule.update({ courierId: null }, { where: { courierId: courierInstance.id } });
  if (userInstance) {
    await userInstance.destroy();
  }
  if (participantInstance) {
    await participantInstance.destroy();
  }

  await courierInstance.destroy();

  return {
    success: true,
    message: 'Courier Successfully Deleted',
    content: 'Courier Successfully Deleted',
  };
};

module.exports = {
  selectAllCouriers,
  selectCourier,
  validateCourierInputs,
  createCourier,
  updateCourier,
  deleteCourier,
};
