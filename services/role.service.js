/* eslint-disable no-param-reassign */
const { Op } = require('sequelize');
const {
  USR_Role, USR_Feature, USR_Module, QRM_QRTemplate,
} = require('../models');

const selectAllRoles = async () => {
  const data = await USR_Role.findAll({
    attributes: ['id', 'name'],
    include: [
      {
        model: USR_Feature,
        attributes: ['id', 'name'],
        include: { model: USR_Module, attributes: ['id', 'name'] },
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
        module: feature.USR_Module.dataValues.name,
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
        attributes: ['id', 'name'],
        include: { model: USR_Module, attributes: ['id', 'name'] },
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
  roleInstance.dataValues.features = [];
  roleInstance.USR_Features.forEach((feature) => {
    roleInstance.dataValues.features.push({
      id: feature.id,
      name: feature.name,
      module: feature.dataValues.USR_Module,
    });
  });
  delete roleInstance.dataValues.USR_Features;

  return { success: true, message: 'Success Getting Role', content: roleInstance };
};

const validateRoleInputs = async (form) => {
  const validFeatures = await USR_Feature.findAll({
    where: {
      id: { [Op.in]: form.features },
    },
  });

  const templateInstance = await QRM_QRTemplate.findByPk(form.templateId);
  if (!templateInstance) {
    return { isValid: false, code: 404, message: ['Qr Template Data Not Found'] };
  }

  return {
    isValid: true, name: form.name, templateId: Number(form.templateId), features: validFeatures,
  };
};

const createRole = async (form) => {
  // create new role first
  const roleInstance = await USR_Role.create({ name: form.name, templateId: form.templateId });

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
