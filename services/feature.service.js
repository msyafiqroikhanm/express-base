const { USR_Feature, USR_Module } = require('../models');

const selectAllFeatures = async () => {
  const features = await USR_Feature.findAll();

  return { success: true, message: 'Succesfully Getting All Feature', content: features };
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

const validateFeatureInputs = async (form) => {
  const { moduleId, name } = form;

  // validate module id
  const moduleInstance = await USR_Module.findByPk(moduleId);
  if (!moduleInstance) {
    return { isValid: false, message: ['Module Data Not Found'] };
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
