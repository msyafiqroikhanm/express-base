/* eslint-disable no-param-reassign */
const { Op } = require('sequelize');
const { USR_Feature, USR_Module } = require('../models');

const selectAllFeatures = async () => {
  const features = await USR_Feature.findAll({ include: { model: USR_Module, attributes: ['name'] } });

  const groupedData = features.reduce((result, item) => {
    const { moduleId } = item;

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
  return { success: true, message: 'Succesfully Getting All Feature', content: Object.values(groupedData) };
};

const selectFeature = async (id) => {
  // validate feature id
  const featureInstance = await USR_Feature.findByPk(id);
  if (!featureInstance) {
    const error = { success: false, code: 404, message: ['Feature Data Not Found'] };
    return error;
  }

  return { success: true, message: 'Succesfully Getting Feature', content: featureInstance };
};

const createFeature = async (form) => {
  try {
    const featureInstance = await USR_Feature.create(form);

    return { success: true, message: 'Feature Successfully Created', content: featureInstance };
  } catch (error) {
    return { success: false, message: [error.errors[0].message] };
  }
};

const validateFeatureInputs = async (form, id) => {
  const { moduleId, name } = form;

  const invalid400 = [];
  const invalid404 = [];

  // check module name duplicate
  const duplicateModule = await USR_Feature.findOne({
    where: id ? { id: { [Op.ne]: id }, name: form.name } : { name },
  });
  if (duplicateModule) {
    invalid400.push('Feature Name Already Taken / Exist');
  }

  // validate module id
  const moduleInstance = await USR_Module.findByPk(moduleId);
  if (!moduleInstance) {
    invalid404.push('Module Data Not Found');
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

  return { isValid: true, form: { moduleId, name } };
};

const updateFeature = async (id, form) => {
  try {
    // validate feature id
    const featureInstance = await USR_Feature.findByPk(id);
    if (!featureInstance) {
      return { success: false, code: 404, message: ['Feature Data Not Found'] };
    }

    // update instance with new data
    featureInstance.name = form.name;
    featureInstance.moduleId = form.moduleId;
    await featureInstance.save();

    return { success: true, message: 'Feature Successfully Updated', content: featureInstance };
  } catch (error) {
    return { success: false, message: [error.errors[0].message] };
  }
};

const deleteFeature = async (id) => {
  try {
    // validate feature id
    const featureInstance = await USR_Feature.findByPk(id);
    if (!featureInstance) {
      return { success: false, code: 404, message: ['Feature Data Not Found'] };
    }

    const { name } = featureInstance.dataValues;

    await featureInstance.destroy();

    return {
      success: true,
      message: 'Feature Successfully Deleted',
      content: `Feature ${name} Successfully Deleted`,
    };
  } catch (error) {
    return { success: false, message: [error.errors[0].message] };
  }
};

module.exports = {
  selectAllFeatures,
  validateFeatureInputs,
  selectFeature,
  createFeature,
  updateFeature,
  deleteFeature,
};
