/* eslint-disable no-param-reassign */
const { Op } = require('sequelize');
const {
  USR_Role, USR_Feature, USR_Module, QRM_QRTemplate, USR_User,
} = require('../models');

const selectAllRoles = async () => {
  const data = await USR_Role.findAll({
    attributes: ['id', 'name', 'isAdministrative'],
    include: [
      {
        model: USR_Feature,
        attributes: ['id', 'name'],
        through: {
          attributes: [],
        },
      },
      {
        model: QRM_QRTemplate,
        as: 'template',
        attributes: ['id', 'name'],
      },
    ],
  });

  // parse response to rename USR_Features to features and USR_Module to module
  data.forEach((role) => {
    // create new array to hold parse feature
    role.dataValues.features = [];

    // getting feature information from USR_Features and save it in feature array
    role.USR_Features.forEach((feature) => {
      role.dataValues.features.push({
        id: feature.id,
        name: feature.name,
      });
    });

    delete role.dataValues.USR_Features;
  });

  return { success: true, message: 'Successfully Getting All Roles', content: data };
};

const selectRole = async (id) => {
  // validate role id
  const roleInstance = await USR_Role.findByPk(id, {
    include: [
      {
        model: USR_Feature,
        attributes: ['id', 'name', 'moduleId'],
        include: { model: USR_Module, attributes: ['name'] },
        through: {
          attributes: [],
        },
      },
      {
        model: QRM_QRTemplate,
        as: 'template',
        attributes: ['id', 'name', 'file'],
      },
    ],
  });
  if (!roleInstance) {
    const error = { success: false, message: ['Role Not Found'] };
    return error;
  }

  // parse response to rename USR_Features to features and USR_Module to module
  roleInstance.dataValues.featureList = [];

  const groupedData = roleInstance.USR_Features.reduce((result, item) => {
    const { moduleId } = item;

    roleInstance.dataValues.featureList.push(item.id);

    // Check if there is already an entry for this moduleId
    if (!result[moduleId]) {
      result[moduleId] = {
        moduleId,
        module: item.USR_Module.dataValues.name,
        items: [],
      };
    }

    delete item.dataValues.USR_Module;

    // Push the item into the corresponding moduleId's items array
    result[moduleId].items.push(item);

    return result;
  }, {});

  roleInstance.dataValues.features = Object.values(groupedData);
  delete roleInstance.dataValues.USR_Features;

  return { success: true, message: 'Success Getting Role', content: roleInstance };
};

const validateRoleInputs = async (form, id) => {
  const invalid400 = [];
  const invalid404 = [];

  const validFeatures = await USR_Feature.findAll({
    where: {
      id: { [Op.in]: form.features },
    },
  });

  const templateInstance = await QRM_QRTemplate.findByPk(form.templateId);
  if (!templateInstance) {
    invalid404.push('Qr Template Data Not Found');
  }

  // check role name duplicate
  const duplicateRole = await USR_Role.findOne({
    where: id ? { id: { [Op.ne]: id }, name: form.name } : { name: form.name },
  });
  if (duplicateRole) {
    invalid400.push('Role Name Already Taken / Exist');
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

  let isAdministrative;
  if (typeof form.isAdministrative === 'boolean') {
    isAdministrative = form.isAdministrative;
  } else {
    isAdministrative = form.isAdministrative?.toLowerCase() === 'true';
  }
  return {
    isValid: true,
    form: {
      name: form.name,
      templateId: Number(form.templateId),
      features: validFeatures,
      isAdministrative,
    },
  };
};

const createRole = async (form) => {
  // create new role first
  const roleInstance = await USR_Role.create({
    name: form.name, templateId: form.templateId, isAdministrative: form.isAdministrative,
  });

  await roleInstance.addUSR_Features(form.features);

  const data = await USR_Role.findByPk(roleInstance.id, {
    include: {
      model: USR_Feature,
      attributes: ['id', 'name'],
      include: { model: USR_Module, attributes: ['id', 'name'] },
      through: {
        attributes: [],
      },
    },
  });

  // parse response to rename USR_Features to features and USR_Module to module
  data.dataValues.features = [];
  data.USR_Features.forEach((feature) => {
    data.dataValues.features.push({
      id: feature.id,
      name: feature.name,
      module: feature.dataValues.USR_Module,
    });
  });
  delete data.dataValues.USR_Features;

  return { success: true, message: 'Role Successfully Created', content: data };
};

const updateRole = async (id, form) => {
  // validate role id
  const roleInstance = await USR_Role.findByPk(id);
  if (!roleInstance) {
    const error = { succcess: false, code: 404, message: ['Role Data Not Found'] };
    return error;
  }

  await roleInstance.setUSR_Features(form.features);

  const data = await USR_Role.findByPk(roleInstance.id, {
    include: {
      model: USR_Feature,
      attributes: ['id', 'name'],
      include: { model: USR_Module, attributes: ['id', 'name'] },
      through: {
        attributes: [],
      },
    },
  });

  data.name = form.name;
  data.templateId = form.templateId;
  data.isAdministrative = form.isAdministrative;
  await data.save();

  // parse response to rename USR_Features to features and USR_Module to module
  data.dataValues.features = [];
  data.USR_Features.forEach((feature) => {
    data.dataValues.features.push({
      id: feature.id,
      name: feature.name,
      module: feature.dataValues.USR_Module,
    });
  });
  delete data.dataValues.USR_Features;

  return { succcess: true, message: 'Role Successfully Updated', content: data };
};

const deleteRole = async (id) => {
  // validate role id
  const roleInstance = await USR_Role.findByPk(id);
  if (!roleInstance) {
    const error = { succcess: false, code: 404, message: ['Role Not Found'] };
    return error;
  }

  const features = await roleInstance.getUSR_Features();
  roleInstance.removeUSR_Features(features);

  const { name } = roleInstance.dataValues;

  await roleInstance.destroy();

  await USR_User.update(
    { roleId: null },
    { where: { roleId: id } },
  );

  return {
    success: true,
    message: 'Role Successfully Deleted',
    content: `Role ${name} Successfully Deleted`,
  };
};

module.exports = {
  validateRoleInputs,
  selectAllRoles,
  selectRole,
  createRole,
  updateRole,
  deleteRole,
};
