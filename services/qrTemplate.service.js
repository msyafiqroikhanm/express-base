const deleteFile = require('../helpers/deleteFile.helper');
const { QRM_QRTemplate } = require('../models');

const selectAllQRTemplates = async () => {
  const templates = await QRM_QRTemplate.findAll();

  return {
    success: true,
    message: 'Successfully Getting All QR Templates',
    content: templates,
  };
};

const selectQrTemplate = async (id) => {
  const templateInstance = await QRM_QRTemplate.findByPk(id);
  if (!templateInstance) {
    const error = { success: false, message: 'QR Template Data Not Found' };
    return error;
  }

  return { success: true, message: 'Successfully Getting QR Template Data', content: templateInstance };
};

const validateQRTemplateInputs = async (file, form) => {
  if (!form.name) {
    const error = { isValid: false, message: 'Name attribute can\'t be empty' };
    return error;
  }

  if (!file) {
    const error = { isValid: false, message: 'Template File Required' };
    return error;
  }

  if (!['png', 'jpeg'].includes(file.originalname.split('.')[1])) {
    const error = { isValid: false, message: 'Upload only supports file types [png and jpeg]' };
    return error;
  }
  return { isValid: true, name: form.name, file: `public/images/qrTemplates/${file.filename}` };
};

const createQRTemplate = async (name, file) => {
  try {
    const templateInstance = await QRM_QRTemplate.create({
      name,
      file,
    });

    return { success: true, message: 'QR Template Successfully Created', content: templateInstance };
  } catch (error) {
    console.log(JSON.stringify(error, null, 4));
    return { success: false, message: error.errors[0].message };
  }
};

const updateQRTemplate = async (id, name, file) => {
  // check if qr template id is valid
  const templateInstance = await QRM_QRTemplate.findByPk(id);
  if (!templateInstance) {
    const error = { success: false, code: 404, message: 'QR Template Data Not Found' };
    return error;
  }

  // delete old file when user uploaded new image
  await deleteFile(templateInstance.file);

  // update QR Template after passed all the check
  templateInstance.name = name;
  templateInstance.file = file;
  await templateInstance.save();

  return { success: true, message: 'QR Template Successfully Updated', content: templateInstance };
};

const deleteQRTemplate = async (id) => {
  // check if qr template id is valid
  const templateInstance = await QRM_QRTemplate.findByPk(id);
  if (!templateInstance) {
    const error = { success: false, code: 404, message: 'QR Template Data Not Found' };
    return error;
  }

  const { name } = templateInstance.dataValues;

  // delete qr template file and qr template data
  await deleteFile(templateInstance.file);
  await templateInstance.destroy();

  return {
    success: true,
    message: 'QR Template Successfully Deleted',
    content: `QR Template ${name} Successfully Deleted`,
  };
};

module.exports = {
  selectAllQRTemplates,
  selectQrTemplate,
  validateQRTemplateInputs,
  createQRTemplate,
  updateQRTemplate,
  deleteQRTemplate,
};
