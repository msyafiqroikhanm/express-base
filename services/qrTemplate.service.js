const deleteFile = require('../helpers/deleteFile.helper');
const { QRM_QRTemplate, REF_QRType } = require('../models');

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
  if (!file) {
    const error = { isValid: false, message: 'Template File Required' };
    return error;
  }

  const typeInstance = await REF_QRType.findByPk(form.typeId);
  if (!typeInstance) {
    const error = { isValid: false, code: 404, message: 'QR Type Data Not Found' };
    return error;
  }

  if (!['png', 'jpeg'].includes(file.originalname.split('.')[1])) {
    const error = { isValid: false, message: 'Upload only supports file types [png and jpeg]' };
    return error;
  }
  return {
    isValid: true,
    typeId: form.typeId,
    name: form.name,
    xCoordinate: form.xCoordinate,
    yCoordinate: form.yCoordinate,
    file: `public/images/qrTemplates/${file.filename}`,
  };
};

const createQRTemplate = async (form, file) => {
  try {
    const templateInstance = await QRM_QRTemplate.create({
      typeId: form.typeId,
      name: form.name,
      xCoordinate: form.xCoordinate,
      yCoordinate: form.yCoordinate,
      file,
    });

    return { success: true, message: 'QR Template Successfully Created', content: templateInstance };
  } catch (error) {
    return { success: false, message: error.errors[0].message };
  }
};

const updateQRTemplate = async (id, form, file) => {
  // check if qr template id is valid
  const templateInstance = await QRM_QRTemplate.findByPk(id);
  if (!templateInstance) {
    const error = { success: false, code: 404, message: 'QR Template Data Not Found' };
    return error;
  }

  // delete old file when user uploaded new image
  await deleteFile(templateInstance.file);

  // update QR Template after passed all the check
  templateInstance.typeId = form.typeId;
  templateInstance.name = form.name;
  templateInstance.xCoordinate = form.xCoordinate;
  templateInstance.yCoordinate = form.yCoordinate;
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
