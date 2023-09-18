const { Op } = require('sequelize');
const { USR_Module, USR_Feature, USR_RoleFeature } = require('../models');

const validateModuleQuery = async (query) => {
  const parsedQuery = {};

  if (query.type) {
    parsedQuery.type = query.type.toLowerCase();
  }

  return parsedQuery;
};

const selectAllModules = async (query) => {
  const modules = await USR_Module.findAll();

  const data = { mainModule: [], subModule: [] };
  modules.forEach((module) => {
    if (module.parentModuleId) {
      data.subModule.push(module);
    } else {
      data.mainModule.push(module);
    }
  });

  let parsedData = data;
  if (query?.type === 'mainmodule') {
    parsedData = data.mainModule;
  } else if (query?.type === 'submodule') {
    parsedData = data.subModule;
  }

  return {
    success: true,
    message: 'Successfully Getting All Module',
    content: parsedData,
  };
};

const selectModule = async (id) => {
  // validate module id
  const moduleInstance = await USR_Module.findByPk(id, {
    include: { model: USR_Module, as: 'parentModule', attributes: ['name'] },
  });
  if (!moduleInstance) {
    const error = { success: false, code: 404, message: ['Module Data Not Found'] };
    return error;
  }

  moduleInstance.dataValues.parentModule = moduleInstance.parentModule?.dataValues.name || null;

  return { success: true, message: 'Successfully Getting Module Data', content: moduleInstance };
};

const createMainModule = async (form) => {
  try {
    // check module name duplicate
    const duplicateModule = await USR_Module.findOne({ where: { name: form.name } });
    if (duplicateModule) {
      return { success: false, code: 400, message: ['Feature Name Already Taken / Exist'] };
    }
    const moduleInstance = await USR_Module.create(form);
    return { success: true, message: 'Module Successfully Created', content: moduleInstance };
  } catch (error) {
    return { success: false, message: [error.errors[0].message] };
  }
};

const createSubModule = async (form) => {
  try {
    const invalid400 = [];
    const invalid404 = [];

    // check module name duplicate
    const duplicateModule = await USR_Module.findOne({ where: { name: form.name } });
    if (duplicateModule) {
      invalid400.push('Feature Name Already Taken / Exist');
    }

    // check if parent faq is exist and main module
    const mainModule = await USR_Module.findByPk(form.parentModuleId);
    if (!mainModule) {
      invalid404.push('Main / Parent Module Data Not Found');
    }
    if (mainModule?.parentModuleId) {
      invalid400.push('Sub Module Can\t be Set As Parent Module');
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

    const moduleInstance = await USR_Module.create(form);
    return { success: true, message: 'Module Successfully Created', content: moduleInstance };
  } catch (error) {
    return { success: false, message: [error.errors[0].message] };
  }
};

const updateMainModule = async (id, form) => {
  try {
    const invalid400 = [];
    const invalid404 = [];

    // check module name duplicate
    const duplicateModule = await USR_Module.findOne({
      where: { id: { [Op.ne]: id }, name: form.name },
    });
    if (duplicateModule) {
      invalid400.push('Feature Name Already Taken / Exist');
    }
    // validate module id
    const moduleInstance = await USR_Module.findByPk(id);
    if (!moduleInstance) {
      invalid404.push('Module Data Not Found');
    }
    if (moduleInstance?.parentModuleId) {
      invalid400.push('Can\'t Update Sub Module Using Main Module Endpoint');
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

    moduleInstance.name = form.name;
    await moduleInstance.save();

    return { success: true, message: 'Module Successfully Updated', content: moduleInstance };
  } catch (error) {
    return { success: false, message: [error.errors[0].message] };
  }
};

const updateSubModule = async (id, form) => {
  try {
    const invalid400 = [];
    const invalid404 = [];

    // check module name duplicate
    const duplicateModule = await USR_Module.findOne({
      where: { id: { [Op.ne]: id }, name: form.name },
    });
    if (duplicateModule) {
      invalid400.push('Feature Name Already Taken / Exist');
    }

    // validate module id
    const moduleInstance = await USR_Module.findByPk(id);
    if (!moduleInstance) {
      invalid404.push('Module Data Not Found');
    } else if (!moduleInstance?.parentModuleId) {
      invalid400.push('Can\'t Update Main Module Using Sub Module Endpoint');
    }

    // check if parent faq is exist and main module
    const mainModule = await USR_Module.findByPk(form.parentModuleId);
    if (!mainModule) {
      invalid404.push('Main / Parent Module Data Not Found');
    } else if (mainModule?.parentModuleId) {
      invalid400.push('Sub Module Can\t be Set As Parent Module');
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

    // after pass the check update instance with new data
    moduleInstance.parentModuleId = Number(form.parentModuleId);
    moduleInstance.name = form.name;
    await moduleInstance.save();

    return { success: true, message: 'Module Successfully Updated', content: moduleInstance };
  } catch (error) {
    return { success: false, message: [error.errors[0].message] };
  }
};

const deleteModule = async (id) => {
  try {
    // validate module id
    const moduleInstance = await USR_Module.findByPk(id);
    if (!moduleInstance) {
      const error = { success: false, code: 404, message: ['Module Data Not Found'] };
      return error;
    }

    const { name } = moduleInstance.dataValues;

    await moduleInstance.destroy();

    await USR_Module.update(
      { parentModuleId: null },
      {
        where: {
          parentModuleId: moduleInstance.id,
        },
      },
    );

    // delete all feature data and feature association in juntion table
    const deletedFeature = await USR_Feature.findAll({
      where: { moduleId: moduleInstance.id },
    });
    const deletedFeatureId = deletedFeature.map((feature) => feature.id);

    await USR_RoleFeature.destroy({
      where: { featureId: { [Op.in]: deletedFeatureId } },
    });

    await USR_Feature.destroy({
      where: { moduleId: moduleInstance.id },
    });

    return {
      success: true,
      message: 'Module Successfully Deleted',
      content: `Module ${name} Successfully Deleted`,
    };
  } catch (error) {
    return { success: false, message: [error.errors[0].message] };
  }
};

module.exports = {
  validateModuleQuery,
  selectAllModules,
  selectModule,
  createMainModule,
  createSubModule,
  updateMainModule,
  updateSubModule,
  deleteModule,
};
