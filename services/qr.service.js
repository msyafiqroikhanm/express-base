const { relative } = require('path');
const { randomUUID } = require('crypto');
const Jimp = require('jimp');
const QRCode = require('qrcode');
const { QRM_QR, QRM_QRTemplate, REF_QRType } = require('../models');
const deleteFile = require('../helpers/deleteFile.helper');

const selectAllQR = async () => {
  const qrs = await QRM_QR.findAll();

  return {
    success: true,
    message: 'Successfully Getting All QR',
    content: qrs,
  };
};

const selectQR = async (id) => {
  // qr id validity
  const qrInstance = await QRM_QR.findByPk(id);
  if (!qrInstance) {
    const error = { success: false, code: 404, message: 'QR Data Not Found' };
    return error;
  }

  return { success: true, message: 'Successfully Getting QR Data', content: qrInstance };
};

const validateQRInputs = async (form) => {
  const {
    templateId, typeId,
  } = form;

  // check validity of template id
  const templateInstance = await QRM_QRTemplate.findByPk(templateId);
  if (!templateInstance) {
    const error = { isValid: false, code: 404, message: 'Invalid templateId Value, QR Template Data Not Found' };
    return error;
  }

  // check validity of type id
  const typeInstance = await REF_QRType.findByPk(typeId);
  if (!typeInstance) {
    const error = { isValid: false, code: 404, message: 'Invalid typeId Value, QR Type Data Not Found' };
    return error;
  }

  console.log(JSON.stringify(templateInstance, null, 2));

  return {
    isValid: true,
    form: { templateId, typeId },
    file: {
      rawFile: `public/images/qrs/qrs-${Date.now()}.png`,
      combineFile: `public/images/qrCombines/combines-${Date.now()}.png`,
    },
  };
};

const generateQRCode = async (form, qrInstance) => {
  const typeInstance = await REF_QRType.findByPk(form.typeId);
  const uuid = randomUUID();
  return `${typeInstance.label}-${qrInstance.id}-${uuid}`;
};

const generateQRFile = async (data, code) => {
  await QRCode.toFile(data.rawFile, code, {
    color: {
      light: '#0000', // Transparent background
    },
    function(err) {
      if (err) throw err;
      console.log('done');
    },
  });

  console.log('Success Generating QR File');
};

const combineQrFile = async (filePath = { qr: '', template: '', output: '' }, coordinate = { x: '', y: '' }) => {
  try {
    const [template, qr] = await Promise.all(
      [Jimp.read(filePath.template), Jimp.read(filePath.qr)],
    );

    template.composite(qr, coordinate.x, coordinate.y);

    await template.writeAsync(filePath.output);
    console.log('Success Combining QR With Template');
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
    throw error;
  }
};

const createQR = async (form, file) => {
  const { templateId, typeId } = form;
  const { rawFile, combineFile } = file;
  const qrInstance = await QRM_QR.create({
    templateId, typeId, rawFile, combineFile,
  });

  const code = await generateQRCode(form, qrInstance);

  // getting path for the template image
  const templateInstance = await QRM_QRTemplate.findByPk(templateId, { attributes: ['file', 'xCoordinate', 'yCoordinate'] });

  try {
    await generateQRFile(qrInstance, code).then(async () => {
      await combineQrFile(
        { qr: rawFile, template: templateInstance.file, output: combineFile },
        { x: Number(templateInstance.xCoordinate), y: Number(templateInstance.yCoordinate) },
      );
    });
  } catch (error) {
    // when error happen delete all related file and delete qr data
    await deleteFile(relative(__dirname, file.rawFile));
    await deleteFile(relative(__dirname, file.combineFile));
    await qrInstance.destroy();
    console.error('Failed Creating QR');
    throw error;
  }

  // generate code for qr
  qrInstance.code = code;
  await qrInstance.save();

  return { success: true, message: 'QR Successfully Created', content: qrInstance };
};

const updateQR = async (id, form, file) => {
  const { templateId, typeId } = form;
  const { rawFile, combineFile } = file;

  // check qr id validity
  const qrInstance = await QRM_QR.findByPk(id);
  if (!qrInstance) {
    const error = { success: false, code: 404, message: 'QR Data Not Found' };
    return error;
  }

  // getting path for the template image
  const templateInstance = await QRM_QRTemplate.findByPk(templateId, { attributes: ['file', 'xCoordinate', 'yCoordinate'] });

  if (qrInstance.typeId !== Number(typeId)) {
    // when type id change, delete and regenerate rawfile and combinefile
    qrInstance.typeId = typeId;
    const tempQrFile = qrInstance.rawFile;
    const tempCombineFile = qrInstance.combineFile;

    // regenerate file
    const code = await generateQRCode(form, qrInstance);
    try {
      // creating new file
      await generateQRFile(file, code).then(async () => {
        await combineQrFile(
          { qr: rawFile, template: templateInstance.file, output: combineFile },
          { x: Number(templateInstance.xCoordinate), y: Number(templateInstance.yCoordinate) },
        );
      });
    } catch (error) {
      // when error happen delete all related file and delete qr data
      await deleteFile(relative(__dirname, rawFile));
      await deleteFile(relative(__dirname, combineFile));
      console.error('Failed Updating QR');
      console.log(JSON.stringify(error, null, 4));
      const newError = { success: false, code: 500, message: error };
      return newError;
    }

    // delete old file
    console.log(tempCombineFile);
    console.log(tempQrFile);
    await deleteFile(relative(__dirname, tempQrFile));
    await deleteFile(relative(__dirname, tempCombineFile));

    // saving new data
    qrInstance.code = code;
    qrInstance.rawFile = rawFile;
    qrInstance.combineFile = combineFile;
    await qrInstance.save();
  } else if (qrInstance.templateId !== Number(form.templateId)) {
    // when template id change, delete and reqenerate combinefile
    qrInstance.templateId = form.templateId;

    const tempCombineFile = qrInstance.combineFile;

    // regenerate combine file
    await combineQrFile(
      { qr: qrInstance.rawFile, template: templateInstance.file, output: combineFile },
      { x: Number(templateInstance.xCoordinate), y: Number(templateInstance.yCoordinate) },
    );

    // delete old file;
    await deleteFile(relative(__dirname, tempCombineFile));

    // save new data'
    qrInstance.combineFile = combineFile;
    await qrInstance.save();
  }
  return { success: true, message: 'Success Updating QR', content: qrInstance };
};

const deleteQR = async (id) => {
  // check if qr id is valid
  const qrInstance = await QRM_QR.findByPk(id);
  if (!qrInstance) {
    const error = { success: false, code: 404, message: 'QR Data Not Found' };
    return error;
  }

  const { code } = qrInstance.dataValues;
  const tempQrFile = qrInstance.rawFile;
  const tempCombineFile = qrInstance.combineFile;

  // delete qr data
  await qrInstance.destroy();

  // delete qr file
  await deleteFile(relative(__dirname, tempQrFile));
  await deleteFile(relative(__dirname, tempCombineFile));

  return {
    success: true,
    message: 'QR Successfully Deleted',
    content: `QR ${code} Successfully Deleted`,
  };
};

module.exports = {
  selectAllQR,
  selectQR,
  validateQRInputs,
  createQR,
  generateQRFile,
  updateQR,
  deleteQR,
};
