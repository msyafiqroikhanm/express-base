const { REF_ConfigurationCategory, SYS_Configuration } = require('../models');

const selectAllConfigCategories = async () => {
  const data = await REF_ConfigurationCategory.findAll();
  return data;
};

const selectConfiCategory = async (id) => {
  const data = await REF_ConfigurationCategory.findByPk(id, {
    include: { model: SYS_Configuration },
  });
  return data;
};

const createSysConfigCategory = async (form) => {
  const data = await REF_ConfigurationCategory.create(form);
  return data;
};

const updateSysConfigCategory = async (id, form) => {
  // get category data (instance)
  const categoryInstance = await REF_ConfigurationCategory.findByPk(id);

  // when category data is not found throw an error
  if (!categoryInstance) {
    throw {
      code: 404,
      status: 'Update System Configuration Category Failed',
      message: 'System Configuration Category Data Not Found',
    };
  }

  // update category data after pass all the check
  categoryInstance.name = form.name;
  await categoryInstance.save();

  return categoryInstance;
};

module.exports = {
  selectAllConfigCategories,
  selectConfiCategory,
  createSysConfigCategory,
  updateSysConfigCategory,
};
