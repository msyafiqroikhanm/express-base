/* eslint-disable no-param-reassign */
const fs = require('fs/promises');
const { Op } = require('sequelize');
const XLSX = require('xlsx');
const {
  PAR_Participant, REF_IdentityType, REF_ParticipantType, QRM_QR,
  PAR_Contingent, REF_Region, PAR_Group, QRM_QRTemplate, PAR_ParticipantTracking,
} = require('../models');
const { createQR } = require('./qr.service');

const validateParticipantQuery = async (query) => {
  const parsedQuery = {};

  if (query.contingent) {
    const contingentInstance = await PAR_Contingent.findOne({ where: { name: { [Op.like]: `%${query.contingent}%` } } });
    console.log(JSON.stringify(contingentInstance, null, 2));
    parsedQuery.contingentId = contingentInstance?.id || null;
  }

  return parsedQuery;
};

const selectAllParticipant = async (query) => {
  const participants = await PAR_Participant.findAll({
    where: query,
    include: [
      {
        model: PAR_Contingent,
        as: 'contingent',
        attributes: ['name'],
        include: { model: REF_Region, as: 'region', attributes: ['name'] },
      },
      { model: QRM_QR, as: 'qr' },
      { model: REF_IdentityType, attributes: ['name'], as: 'identityType' },
      { model: REF_ParticipantType, attributes: ['name'], as: 'participantType' },
      { model: PAR_Group, as: 'groups', through: { attributes: [] } },
    ],
  });

  // parsed retun data
  participants.forEach((participant) => {
    if (participant.contingent) {
      participant.contingent.dataValues.region = participant.contingent.region.dataValues.name;
    }
    participant.dataValues.identityType = participant.identityType.dataValues.name;
    participant.dataValues.participantType = participant.participantType.dataValues.name;
  });

  return {
    success: true, message: 'Successfully Getting All Participant', content: participants,
  };
};

const selectParticipant = async (id) => {
  const participantInstance = await PAR_Participant.findByPk(id, {
    include: [
      {
        model: PAR_Contingent,
        as: 'contingent',
        attributes: ['id', 'name'],
        include: { model: REF_Region, as: 'region', attributes: ['id', 'name'] },
      },
      { model: QRM_QR, as: 'qr' },
      { model: REF_IdentityType, attributes: ['id', 'name'], as: 'identityType' },
      { model: REF_ParticipantType, attributes: ['id', 'name'], as: 'participantType' },
      { model: PAR_Group, as: 'groups', through: { attributes: [] } },
      { model: PAR_ParticipantTracking, as: 'history' },
    ],
  });

  if (!participantInstance) {
    return {
      success: false, code: 404, message: 'Participant Data Not Found',
    };
  }

  return {
    success: true, message: 'Successfully Getting Participant', content: participantInstance,
  };
};

const validateParticipantInputs = async (form, file, id) => {
  const {
    contingentId, typeId, identityTypeId, name, gender,
    birthDate, identityNo, phoneNbr, email, address,
  } = form;

  // check contingent id validity
  const contingentInstance = await PAR_Contingent.findByPk(contingentId);
  if (!contingentInstance) {
    return {
      isValid: false, code: 404, message: 'Contingent Data Not Found',
    };
  }

  // check participant type id validity
  const participantTypeInstance = await REF_ParticipantType.findByPk(typeId);
  if (!participantTypeInstance) {
    return {
      isValid: false, code: 404, message: 'Participant Type Data Not Found',
    };
  }

  // check identity type id validity
  const identityTypeInstance = await REF_IdentityType.findByPk(identityTypeId);
  if (!identityTypeInstance) {
    return {
      isValid: false, code: 404, message: 'Identity Type Data Not Found',
    };
  }

  let filePath = null;
  if (file) {
    if (!['png', 'jpeg', 'jpg'].includes(file.originalname.split('.')[1])) {
      const error = { isValid: false, code: 400, message: 'Upload only supports file types [png, jpeg, and jpg]' };
      return error;
    }

    const imageBuffer = await fs.readFile(file.path);
    const maxSizeInByte = 2000000;
    if (imageBuffer.length > maxSizeInByte) {
      return { isValid: false, code: 400, message: 'The file size exceeds the maximum size limit of 2 Megabyte' };
    }

    filePath = `public/images/participants/${file.filename}`;
  }

  if (id) {
    // check identity number duplicate
    const isDuplicateIdentityNo = await PAR_Participant.findOne({
      where: {
        id: { [Op.ne]: id },
        identityNo,
      },
    });
    if (isDuplicateIdentityNo) {
      return {
        isValid: false, code: 400, message: `Identity Number ${identityNo} Already Used In System`,
      };
    }

    // check phone number duplicate
    const isDuplicatePhoneNo = await PAR_Participant.findOne({
      where: {
        id: { [Op.ne]: id },
        phoneNbr,
      },
    });
    if (isDuplicatePhoneNo) {
      return {
        isValid: false, code: 400, message: `Phone Number ${phoneNbr} Already Used In System`,
      };
    }
  } else {
    // check identity number duplicate
    const isDuplicateIdentityNo = await PAR_Participant.findOne({ where: { identityNo } });
    if (isDuplicateIdentityNo) {
      return {
        isValid: false, code: 400, message: `Identity Number ${identityNo} Already Used In System`,
      };
    }

    // check phone number duplicate
    const isDuplicatePhoneNo = await PAR_Participant.findOne({ where: { phoneNbr } });
    if (isDuplicatePhoneNo) {
      return {
        isValid: false, code: 400, message: `Phone Number ${phoneNbr} Already Used In System`,
      };
    }
  }

  return {
    isValid: true,
    form: {
      contingent: contingentInstance,
      participantType: participantTypeInstance,
      identityType: identityTypeInstance,
      name,
      gender,
      birthDate: new Date(birthDate),
      identityNo,
      phoneNbr,
      email,
      address,
      file: filePath,
    },
  };
};

const createParticipant = async (form) => {
  // Qr setup for participant
  const templateInstance = await QRM_QRTemplate.findOne({ where: { name: { [Op.like]: '%participant%' } } });
  const qrInstance = await createQR({ templateId: templateInstance?.id || 1 }, { rawFile: `public/images/qrs/qrs-${Date.now()}.png`, combineFile: `public/images/qrCombines/combines-${Date.now()}.png` });

  // creating participant
  const participantInstance = await PAR_Participant.create({
    contingentId: form.contingent.id,
    qrId: qrInstance.content.id,
    typeId: form.participantType.id,
    identityTypeId: form.identityType.id,
    name: form.name,
    gender: form.gender,
    birthDate: form.birthDate,
    identityNo: form.identityNo,
    phoneNbr: form.phoneNbr,
    email: form.email,
    address: form.address,
    file: form.file,
  });

  return {
    success: true, message: 'Participant Successfully Created', content: participantInstance,
  };
};

const updateParticipant = async (id, form) => {
  const participantInstance = await PAR_Participant.findByPk(id);
  if (!participantInstance) {
    return {
      success: false, code: 404, message: 'Participant Data Not Found',
    };
  }

  participantInstance.contingetId = form.contingent.id;
  participantInstance.typeId = form.participantType.id;
  participantInstance.identityTypeId = form.identityType.id;
  participantInstance.name = form.name;
  participantInstance.gender = form.gender;
  participantInstance.birthDate = form.birthDate;
  participantInstance.identityNo = form.identityNo.id;
  participantInstance.phoneNbr = form.phoneNbr.id;
  participantInstance.email = form.email;
  participantInstance.address = form.address;
  participantInstance.file = form.file;
  await participantInstance.save();

  return {
    success: true, message: 'Participant Successfully Updated', content: participantInstance,
  };
};

const deleteParticipant = async (id) => {
  // check participant id validity
  const participantInstance = await PAR_Participant.findByPk(id);
  if (!participantInstance) {
    return {
      success: false, code: 404, message: 'Participant Data Not Found',
    };
  }

  const { name } = participantInstance.dataValues;

  await participantInstance.destroy();

  return {
    success: true,
    message: 'Participant Successfully Deleted',
    content: `Participant ${name} Successfully Deleted`,
  };
};

const trackingParticipant = async (form) => {
  // check participant id validity
  const qrInstance = await QRM_QR.findOne({
    where: { code: form.qrCode },
    include: { model: PAR_Participant, as: 'participantQr' },
  });

  console.log(JSON.stringify(qrInstance, null, 2));
  if (!qrInstance) {
    return {
      success: false, code: 404, message: 'QR Data Not Found',
    };
  }

  const trackInstance = await PAR_ParticipantTracking.create({
    participantId: qrInstance.participantQr.id,
    latitude: form.latitude,
    longtitude: form.longtitude,
    accuracy: form.accuracy,
    time: new Date(),
  });

  return {
    success: true, message: 'Praticipant Track Successfully Created', content: trackInstance,
  };
};

const createParticipantViaImport = async (file) => {
  if (!['xlsx'].includes(file.originalname.split('.')[1])) {
    return {
      success: false, code: 400, message: 'Upload only supports file types [xlsx]',
    };
  }

  const participantTypes = await REF_ParticipantType.findAll();
  const identityTypes = await REF_IdentityType.findAll();
  const contignets = await PAR_Contingent.findAll();

  const workbook = XLSX.readFile(file.path);
  const sheet = workbook.SheetNames[0];
  const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
  const participants = data.map((element) => {
    const identityType = identityTypes.find(
      (identity) => identity.name?.toLowerCase() === element.identityType?.toLowerCase(),
    );
    const type = participantTypes.find(
      (participantType) => participantType.name?.toLowerCase() === element.role?.toLowerCase(),
    );
    const contingent = contignets.find(
      (cnt) => cnt.name?.toLowerCase() === element.contingent?.toLowerCase(),
    );
    return {
      name: element.name,
      gender: element.gender,
      birthDate: element.birthDate,
      identityNo: element.identityNo,
      phoneNbr: element.phoneNbr,
      email: element.email,
      address: element.address,
      identityTypeId: identityType?.id || null,
      typeId: type?.id || null,
      contingentId: contingent?.id || null,
    };
  });

  participants.forEach(async (participant) => {
    const inputs = await validateParticipantInputs(participant);
    if (!inputs.isValid && inputs.code === 404) {
      return { success: false, code: 404, message: inputs.message };
    }
    if (!inputs.isValid && inputs.code === 400) {
      return { success: false, code: 400, message: inputs.message };
    }

    await createParticipant(inputs.form);
  });

  return {
    success: true, message: 'Praticipant Successfully Created In Bulk Via Import', content: 'Praticipant Successfully Created In Bulk Via Import',
  };
};

module.exports = {
  selectAllParticipant,
  selectParticipant,
  validateParticipantInputs,
  validateParticipantQuery,
  createParticipant,
  updateParticipant,
  deleteParticipant,
  trackingParticipant,
  createParticipantViaImport,
};
