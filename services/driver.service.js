/* eslint-disable no-param-reassign */
const { Op } = require('sequelize');
const {
  TPT_Driver,
  TPT_Vendor,
  TPT_VehicleSchedule,
  USR_User,
  PAR_Participant,
  TPT_DriverTracking,
} = require('../models');
const {
  validateCommitteeInputs,
  createComittee,
  deleteParticipant,
} = require('./participant.service');
const { validateUserInputs, createUser } = require('./user.service');

const selectAllDrivers = async (where = {}) => {
  const query = {};
  if (where.driverId) {
    query.id = where.driverId;
  }
  if (where.picId) {
    query.vendorId = { [Op.in]: where.vendors };
  }
  if (where.isAvailable) {
    query.isAvailable = where.isAvailable.toLowerCase() === 'true';
  }

  const data = await TPT_Driver.findAll({
    // eslint-disable-next-line no-nested-ternary
    where: Object.keys(query).length > 0 ? query : null,
    order: [
      ['vendorId', 'ASC'],
      ['name', 'ASC'],
    ],
    include: {
      model: TPT_Vendor,
      as: 'vendor',
      attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
    },
  });

  data.forEach((driver) => {
    driver.dataValues.vendor = driver.vendor?.dataValues.name || null;
  });

  return {
    success: true,
    message: 'Successfully Getting All Driver',
    content: data,
  };
};

const selectDriver = async (id, where) => {
  if (where.driverId && where.driverId !== Number(id)) {
    return {
      success: false,
      code: 404,
      message: ['Driver Data Not Found'],
    };
  }

  const driverInstance = await TPT_Driver.findOne({
    where: where.picId ? { id, vendorId: { [Op.in]: where.vendors } } : { id },
    include: {
      model: TPT_Vendor,
      as: 'vendor',
      attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
    },
  });
  if (!driverInstance) {
    return {
      success: false,
      code: 404,
      message: ['Driver Data Not Found'],
    };
  }

  driverInstance.dataValues.vendor = driverInstance.vendor?.dataValues.name || null;

  return {
    success: true,
    message: 'Successfully Getting Driver',
    content: driverInstance,
  };
};

const validateDriverInputs = async (form, where, file, id) => {
  const { vendorId, name, phoneNbr, email } = form;

  const invalid400 = [];
  const invalid404 = [];

  console.log(where.picId);
  console.log(where);

  if (where.picId && !where.vendors?.includes(Number(vendorId))) {
    invalid404.push('Vendor Data Not Found');
  }

  // check vendor id
  const vendorInstance = await TPT_Vendor.findByPk(vendorId);
  if (!vendorInstance) {
    invalid404.push('Vendor Data Not Found');
  }

  let userInstance = null;
  let committeeInstance = null;
  let driverInstance = null;
  if (!id) {
    // validate for committee part of data
    const committeeInputs = await validateCommitteeInputs(
      {
        committeeTypeId: 3,
        identityTypeId: form.identityTypeId,
        name: form.name,
        gender: form.gender,
        birthDate: form.birthDate,
        identityNo: form.identityNo,
        phoneNbr: form.phoneNbr,
        email: form.email ? form.email : null,
        address: form.address,
      },
      file,
      null,
    );
    if (!committeeInputs.isValid && committeeInputs.code === 404) {
      invalid404.push(...committeeInputs.message);
    } else if (!committeeInputs.isValid && committeeInputs.code === 400) {
      invalid400.push(...committeeInputs.message);
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

    committeeInstance = await createComittee(committeeInputs.form);

    // validate for user part of data
    const userInputs = await validateUserInputs(
      {
        roleId: 8,
        participantId: committeeInstance.content?.id,
        username: form.username,
        password: form.password,
        email: form.email ? form.email : null,
      },
      null,
    );

    // when input for creating user is invalid push error according to error code
    // and delete committee participant that created before it
    if (!userInputs.isValid && userInputs.code === 404) {
      invalid404.push(...userInputs.message);
      await deleteParticipant({ id: committeeInstance.content?.id });
    } else if (!userInputs.isValid && userInputs.code === 400) {
      invalid400.push(...userInputs.message);
      await deleteParticipant({ id: committeeInstance.content?.id });
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

    userInstance = await createUser(userInputs.form);
  } else {
    driverInstance = await TPT_Driver.findOne({
      where: { id },
      include: { model: USR_User, attributes: ['id', 'participantId'], as: 'user' },
    });
    if (!driverInstance) {
      invalid404.push('Driver Data Not Found');
    }

    const duplicatePhoneNbr = await PAR_Participant.findOne({
      where: { phoneNbr: form.phoneNbr, id: { [Op.ne]: driverInstance?.user?.participantId } },
    });
    if (duplicatePhoneNbr) {
      invalid400.push('Phone Number Already Exist / Taken');
    }
    // const duplicateEmail = await USR_User.findOne({
    //   where: { email: form.email, id: { [Op.ne]: driverInstance?.user?.id } },
    // });
    // if (duplicateEmail) {
    //   invalid400.push('Email Already Exist / Taken');
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
      vendor: vendorInstance,
      user: userInstance?.content || driverInstance?.user?.id,
      committee: committeeInstance?.content || driverInstance?.user?.participantId,
      name,
      phoneNbr,
      email,
      isAvailable: typeof form.isAvailable !== 'undefined' ? form.isAvailable : null,
    },
  };
};

const createDriver = async (form) => {
  const driverInstance = await TPT_Driver.create({
    vendorId: form.vendor.id,
    userId: form.user.id,
    name: form.name,
    phoneNbr: form.phoneNbr,
    email: form.email,
    isAvailable: typeof form.isAvailable !== 'object' ? form.isAvailable === 'true' : true,
  });

  driverInstance.vendor = form.vendor.name;

  await TPT_DriverTracking.create({
    driverId: driverInstance.id,
    latitude: null,
    longtitude: null,
    accuracy: null,
    time: new Date(),
  });

  return {
    success: true,
    message: 'Driver Successfully Created',
    content: driverInstance,
  };
};

const updateDriver = async (form, id, where) => {
  // updating driver data
  const driverInstance = await TPT_Driver.findOne({
    where: where.picId ? { id, vendorId: { [Op.in]: where.vendors } } : { id },
  });
  if (!driverInstance) {
    return {
      success: false,
      code: 404,
      message: ['Driver Data Not Found'],
    };
  }

  driverInstance.vendorId = form.vendor.id;
  driverInstance.name = form.name;
  driverInstance.phoneNbr = form.phoneNbr;
  driverInstance.email = form.email;
  driverInstance.isAvailable =
    typeof form.isAvailable !== 'object' ? form.isAvailable === 'true' : true;
  await driverInstance.save();

  // updating committee / participant
  await PAR_Participant.update(
    { email: form.email, phoneNbr: form.phoneNbr, name: form.name },
    { where: { id: form.committee || null } },
  );

  // updating user
  await USR_User.update({ email: form.email }, { where: { id: form.user || null } });

  return {
    success: true,
    message: 'Driver Successfully Updated',
    content: driverInstance,
  };
};

const deleteDriver = async (id, where) => {
  const driverInstance = await TPT_Driver.findOne({
    where: where.picId ? { id, vendorId: { [Op.in]: where.vendors } } : { id },
    include: { model: USR_User, attributes: ['id', 'participantId'], as: 'user' },
  });
  if (!driverInstance) {
    return {
      success: false,
      code: 404,
      message: ['Driver Data Not Found'],
    };
  }

  const { name } = driverInstance.dataValues;

  await driverInstance.destroy();
  await PAR_Participant.destroy({ where: { id: driverInstance.user?.participantId || null } });
  await USR_User.destroy({ where: { id: driverInstance.user?.id || null } });

  await TPT_VehicleSchedule.update(
    { driverId: null },
    { where: { driverId: driverInstance.id, dropOffTime: null } },
  );

  return {
    success: true,
    message: 'Driver Successfully Deleted',
    content: `Driver ${name} Successfully Deleted`,
  };
};

module.exports = {
  selectAllDrivers,
  selectDriver,
  validateDriverInputs,
  createDriver,
  updateDriver,
  deleteDriver,
};
