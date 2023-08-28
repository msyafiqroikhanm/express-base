const { USR_Module } = require('../models');

const selectAllModules = async () => {
  const modules = await USR_Module.findAll();

  return {
    success: true,
    message: 'Successfully Getting All Module',
    content: modules,
  };
};

const selectModule = async (id) => {
  // validate module id
  const moduleInstance = await USR_Module.findByPk(id);
  if (!moduleInstance) {
    const error = { success: false, code: 404, message: 'Module Data Not Found' };
    return error;
  }

  return { success: true, message: 'Successfully Getting Module Data', content: moduleInstance };
};

const createModule = async (form) => {
  try {
    const moduleInstance = await USR_Module.create(form);
    return { success: true, message: 'Module Successfully Created', content: moduleInstance };
  } catch (error) {
    return { success: false, message: error.errors[0].message };
  }
};

const updateModule = async (id, form) => {
  try {
    // validate module id
    const moduleInstance = await USR_Module.findByPk(id);
    if (!moduleInstance) {
      const error = { success: false, code: 404, message: 'Module Data Not Found' };
      return error;
    }

    // after pass the check update instance with new data
    moduleInstance.name = form.name;
    await moduleInstance.save();

    return { success: true, message: 'Module Successfully Updated', content: moduleInstance };
  } catch (error) {
    return { success: false, message: error.errors[0].message };
  }
};

const deleteModule = async (id) => {
  try {
    // validate module id
    const moduleInstance = await USR_Module.findByPk(id);
    if (!moduleInstance) {
      const error = { success: false, code: 404, message: 'Module Data Not Found' };
      return error;
    }

    const { name } = moduleInstance.dataValues;

    await moduleInstance.destroy();

    return {
      success: true,
      message: 'Module Successfully Deleted',
      content: `Module ${name} Successfully Deleted`,
    };
  } catch (error) {
    return { success: false, message: error.errors[0].message };
  }
};

module.exports = {
  selectAllModules,
  selectModule,
  createModule,
  updateModule,
  deleteModule,
};
