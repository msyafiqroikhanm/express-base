const { SYS_Configuration, REF_ConfigurationCategory } = require('../models');

const selectAllConfigurations = async () => {
  const data = await SYS_Configuration.findAll();
  return data;
};

const selectConfiguration = async (id) => {
  const data = await SYS_Configuration.findByPk(id, {
    include: { model: REF_ConfigurationCategory },
  });

  if (!data) {
    const error = { success: false, message: 'System Configuration Data Not Found' };
    return error;
  }

  // parse data to have configuration catgory as name
  data.dataValues.category = data.REF_ConfigurationCategory.dataValues.name;
  delete data.dataValues.REF_ConfigurationCategory;
  return { success: true, message: 'Successfully Getting System Configuration Data', content: data };
};

const createConfiguration = async (form) => {
  const { categoryId } = form;

  // check if there is congfig id validity
  const categoryInstance = await REF_ConfigurationCategory.findByPk(categoryId);
  if (!categoryInstance) {
    const error = { success: false, message: 'Configuration Category Not Found' };
    return error;
  }

  const configurationInstance = await SYS_Configuration.create(form);

  return { success: true, content: configurationInstance };
};

const updateConfiguration = async (id, form) => {
  // check if id configuration is valid
  const configurationInstance = await SYS_Configuration.findByPk(id);
  if (!configurationInstance) {
    const error = { success: false, code: 404, message: 'System Configuration Data Not Found' };
    return error;
  }

  // check if id category (of system configuration) is valid
  const categoryInstance = await REF_ConfigurationCategory.findByPk(form.categoryId);
  if (!categoryInstance) {
    const error = { success: false, code: 400, message: 'System Configuration Category Data Not Found' };
    return error;
  }

  // update system configuration after passed all the check
  configurationInstance.categoryId = form.categoryId;
  configurationInstance.name = form.name;
  configurationInstance.value = form.value;
  await configurationInstance.save();

  return { success: true, content: configurationInstance };
};

const deleteConfiguration = async (id) => {
  // check the validity of congfiguration id
  const configurationInstance = await SYS_Configuration.findByPk(id);

  if (!configurationInstance) {
    const error = { success: false, code: 404, message: 'System Configuration Data Not Found' };
    return error;
  }

  const { name } = configurationInstance.dataValues;

  await configurationInstance.destroy();

  return {
    success: true,
    message: 'System Configuration Successfully Deleted',
    content: `Configuration ${name} Successfully Deleted`,
  };
};

module.exports = {
  selectAllConfigurations,
  selectConfiguration,
  createConfiguration,
  updateConfiguration,
  deleteConfiguration,
};
