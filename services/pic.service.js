/* eslint-disable no-param-reassign */
const { USR_PIC, REF_PICType, USR_User } = require('../models');

const selectAllPICs = async () => {
  const pics = await USR_PIC.findAll({
    attributes: ['id', 'userId', 'typeId'],
    include: [
      {
        model: USR_User,
        as: 'user',
        attributes: ['username'],
      },
      {
        model: REF_PICType,
        attributes: ['name'],
      },
    ],
  });

  pics.forEach((pic) => {
    pic.dataValues.type = pic.REF_PICType.dataValues.name;
    delete pic.dataValues.REF_PICType;
  });

  return {
    success: true,
    message: 'Successfully Getting All PIC',
    content: pics,
  };
};

const selectPIC = async (id) => {
  const picInstance = await USR_PIC.findOne({
    where: { id },
    attributes: ['id', 'userId', 'typeId'],
    include: [
      {
        model: USR_User,
        as: 'user',
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
      },
      {
        model: REF_PICType,
        attributes: ['name'],
      },
    ],
  });
  if (!picInstance) {
    return {
      success: false,
      message: ['PIC Data Not Found'],
    };
  }

  picInstance.dataValues.type = picInstance.REF_PICType.dataValues.name;
  delete picInstance.dataValues.REF_PICType;

  return {
    success: true,
    message: 'Successfully Getting Detail PIC',
    content: picInstance,
  };
};

const createPIC = async (form) => {
  const typeInstance = await USR_PIC.create({
    userId: form.userId,
    typeId: form.typeId,
  });

  return {
    success: true,
    message: 'PIC Successfully Created',
    content: typeInstance,
  };
};

const updatePIC = async (id, form) => {
  // check identity type id validity
  const picInstance = await USR_PIC.findOne({ where: { id }, attributes: ['id'] });
  if (!picInstance) {
    return {
      success: false,
      message: ['PIC Data Not Found'],
    };
  }

  const errorMessages = [];
  const typeInstance = await REF_PICType.findByPk(form.typeId);

  if (!typeInstance) {
    errorMessages.push('PIC Type Not Found');
  }

  const userInstance = await USR_User.findByPk(form.userId);
  if (!userInstance) {
    errorMessages.push('User Data Not Found');
  }

  if (errorMessages.length > 0) {
    return { success: false, code: 404, message: errorMessages };
  }

  await USR_PIC.update(
    { userId: form.userId, typeId: form.typeId },
    { where: { id: picInstance.id } },
  );

  return {
    success: true,
    message: 'PIC Successfully Updated',
    content: picInstance,
  };
};

const deletePIC = async (id) => {
  // check identity type id validity
  const picInstance = await USR_PIC.findOne({ where: { id } });
  if (!picInstance) {
    return {
      success: false,
      message: ['PIC Data Not Found'],
    };
  }

  await picInstance.destroy();

  return {
    success: true,
    message: 'PIC Successfully Deleted',
    content: 'PIC Successfully Deleted',
  };
};

const validatePICInputs = async (form) => {
  const errorMessages = [];
  const typeInstance = await REF_PICType.findByPk(form.typeId);
  if (!typeInstance) {
    errorMessages.push('PIC Type Not Found');
  }

  const userInstance = await USR_User.findByPk(form.userId);
  if (!userInstance) {
    errorMessages.push('User Data Not Found');
  }

  const picInstance = await USR_PIC.findOne({
    where: { userId: form.userId, typeId: form.typeId },
  });
  if (picInstance) {
    errorMessages.push('PIC Data already exists');
  }

  // console.log({ userInstance, picInstance });
  if (errorMessages.length > 0) {
    return { isValid: false, code: 404, message: errorMessages };
  }

  return {
    isValid: true,
    form: {
      userId: userInstance.id,
      typeId: typeInstance.id,
    },
  };
};

module.exports = {
  selectAllPICs,
  selectPIC,
  createPIC,
  updatePIC,
  deletePIC,
  validatePICInputs,
};
