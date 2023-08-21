const { REF_ConfigurationCategory, SYS_Configuration, REF_QRType } = require('../models');

const selectAllConfigCategories = async () => {
  const data = await REF_ConfigurationCategory.findAll();
  return data;
};

const selectConfiCategory = async (id) => {
  const data = await REF_ConfigurationCategory.findByPk(id, {
    include: { model: SYS_Configuration },
  });

  if (!data) {
    const error = { success: false, message: 'System Configuration Category Not Found' };
    return error;
  }
  return { success: true, message: 'Successfully Getting System Configuration Category', content: data };
};

const createSysConfigCategory = async (form) => {
  const data = await REF_ConfigurationCategory.create(form);
  return { success: true, message: 'System Configuration Category Successfully Created', content: data };
};

const updateSysConfigCategory = async (id, form) => {
  // get category data (instance)
  const categoryInstance = await REF_ConfigurationCategory.findByPk(id);

  // when category data is not found throw an error
  if (!categoryInstance) {
    const error = { success: false, message: 'System Configuration Category Data Not Found' };
    return error;
  }

  // update category data after pass all the check
  categoryInstance.name = form.name;
  await categoryInstance.save();

  return { success: true, message: 'System Configuration Category Successfully Updated', content: categoryInstance };
};

const deleteSysConfigCategory = async (id) => {
  // check validity of sys config id
  const configInstance = await REF_ConfigurationCategory.findByPk(id);
  if (!configInstance) {
    const error = { success: false, message: 'System Configuration Data Not Found' };
    return error;
  }

  const { name } = configInstance.dataValues;

  // delete sys config after passing the check
  await configInstance.destroy();
  return {
    success: true,
    message: 'System Configuration Successfully Deleted',
    content: `System Configuration ${name} Successfully Deleted`,
  };
};

const selectAllQRTypes = async () => {
  const data = await REF_QRType.findAll();
  return data;
};

const selectQRType = async (id) => {
  // check validity of qrtype id
  const data = await REF_QRType.findByPk(id);
  if (!data) {
    const error = { success: false, message: 'QR Type Data Not Found' };
    return error;
  }

  return { success: true, message: 'Successfully Getting QR Type Data', content: data };
};

const createQRType = async (form) => {
  const qrTypeInstance = await REF_QRType.create(form);
  return { success: true, message: 'QR Type Successfully Created', content: qrTypeInstance };
};

const updateQRType = async (id, form) => {
  // check qr type id validity
  const qrTypeInstance = await REF_QRType.findByPk(id);
  if (!qrTypeInstance) {
    const error = { success: false, message: 'QR Type Data Not Found' };
    return error;
  }

  // update data after success pass the check
  qrTypeInstance.name = form.name;
  qrTypeInstance.label = form.label;
  await qrTypeInstance.save();

  return { success: true, message: 'QR Type Successfully Updated', content: qrTypeInstance };
};

const deleteQRType = async (id) => {
  // check qr type validity
  const qrTypeInstance = await REF_QRType.findByPk(id);
  if (!qrTypeInstance) {
    const error = { success: false, message: 'QR Type Data Not Found' };
    return error;
  }

  const { name } = qrTypeInstance.dataValues;

  // delete the qr type after passsing the check
  await qrTypeInstance.destroy();

  return {
    success: true,
    message: 'QR Type Successfully Deleted',
    content: `QR Type ${name} Successfully Deleted`,
  };
};

module.exports = {
  selectAllConfigCategories,
  selectConfiCategory,
  createSysConfigCategory,
  updateSysConfigCategory,
  deleteSysConfigCategory,
  selectAllQRTypes,
  selectQRType,
  createQRType,
  updateQRType,
  deleteQRType,
};
