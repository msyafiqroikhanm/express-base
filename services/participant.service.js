/* eslint-disable no-param-reassign */
const fs = require('fs/promises');
const fsn = require('fs');
const { relative, join } = require('path');
const { Op } = require('sequelize');
const XLSX = require('xlsx');
const {
  PAR_Participant,
  REF_IdentityType,
  REF_ParticipantType,
  QRM_QR,
  REF_CommitteeType,
  PAR_Contingent,
  REF_Region,
  PAR_Group,
  QRM_QRTemplate,
  PAR_ParticipantTracking,
  TPT_VehicleSchedule,
  TPT_Vehicle,
  ACM_Location,
  REF_VehicleScheduleStatus,
  TPT_Vendor,
  REF_VehicleType,
  ACM_ParticipantLodger,
  ACM_Room,
  REF_RoomType,
  ENV_Event,
  REF_EventCategory,
  SYS_Configuration,
  ACM_RoomBedType,
} = require('../models');
const { createQR } = require('./qr.service');
const deleteFile = require('../helpers/deleteFile.helper');

const calculateAge = (dateOfBirth, dateNow) => {
  const dob = new Date(dateOfBirth);

  const currentDate = new Date(dateNow);

  const age = currentDate.getFullYear() - dob.getFullYear();

  // Check if the birthday for this year has already occurred
  if (
    currentDate.getMonth() < dob.getMonth()
    || (currentDate.getMonth() === dob.getMonth() && currentDate.getDate() < dob.getDate())
  ) {
    return age - 1;
  }

  return age;
};

const selectAllParticipant = async (query, where) => {
  const participants = await PAR_Participant.findAll({
    where: query?.contingentId ? { contingentId: query.contingentId } : null,
    include: [
      {
        model: PAR_Contingent,
        where: Object.keys(where).length > 0 ? where : null,
        as: 'contingent',
        attributes: ['name'],
        include: { model: REF_Region, as: 'region', attributes: ['name'] },
      },
      { model: QRM_QR, as: 'qr' },
      { model: REF_IdentityType, attributes: ['name'], as: 'identityType' },
      { model: REF_ParticipantType, attributes: ['name'], as: 'participantType' },
      {
        model: PAR_Group,
        as: 'groups',
        through: { attributes: [] },
        where: query?.groupId ? { id: query.groupId } : null,
      },
      { model: REF_CommitteeType, as: 'committeeType', attributes: ['name'] },
    ],
  });

  const seperatedParticipant = { committee: [], participant: [] };

  const startEvent = await SYS_Configuration.findOne({
    where: { name: { [Op.substring]: 'Event Start' } },
  });

  // parsed retun data
  participants.forEach((participant) => {
    if (participant.contingent) {
      participant.contingent.dataValues.region = participant.contingent.region?.dataValues.name;
    }
    participant.dataValues.identityType = participant.identityType?.dataValues.name;
    participant.dataValues.participantType = participant.participantType?.dataValues.name;
    participant.dataValues.committeeType = participant.committeeType?.dataValues.name;
    participant.dataValues.age = calculateAge(participant.birthDate, startEvent.value);

    // separating bettween normal participant and committee participant
    if ((participant.contingent && participant.participantType) || !participant.committeeTypeId) {
      seperatedParticipant.participant.push(participant);
    } else {
      seperatedParticipant.committee.push(participant);
    }
  });

  return {
    success: true,
    message: 'Successfully Getting All Participant',
    content: seperatedParticipant,
  };
};

const selectParticipant = async (id, where) => {
  const participantInstance = await PAR_Participant.findOne({
    where: { id },
    include: [
      {
        model: PAR_Contingent,
        where: where.id ? { id: where.id } : null,
        as: 'contingent',
        attributes: ['id', 'name'],
        include: { model: REF_Region, as: 'region', attributes: ['id', 'name'] },
      },
      { model: QRM_QR, as: 'qr' },
      { model: REF_CommitteeType, attributes: ['name'], as: 'committeeType' },
      { model: REF_IdentityType, attributes: ['id', 'name'], as: 'identityType' },
      { model: REF_ParticipantType, attributes: ['id', 'name'], as: 'participantType' },
      {
        model: PAR_Group,
        as: 'groups',
        through: { attributes: [] },
        include: {
          model: ENV_Event,
          as: 'event',
          attributes: { exclude: ['picId', 'createdAt', 'updatedAt'] },
          include: [
            { model: REF_EventCategory, attributes: ['name'], as: 'category' },
            {
              model: ACM_Location,
              attributes: ['parentLocationId', 'name', 'address'],
              as: 'location',
            },
          ],
        },
      },
      { model: PAR_ParticipantTracking, as: 'history' },
      {
        model: ACM_ParticipantLodger,
        as: 'lodgers',
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'participantId'] },
        include: {
          model: ACM_Room,
          as: 'room',
          attributes: ['typeId', 'locationId', 'name', 'floor'],
          include: [
            { model: ACM_RoomBedType, attributes: ['name'], as: 'bed' },
            { model: REF_RoomType, attributes: ['name'], as: 'type' },
            {
              model: ACM_Location,
              attributes: ['parentLocationId', 'name', 'address'],
              as: 'location',
            },
          ],
        },
      },
      {
        model: TPT_VehicleSchedule,
        attributes: { exclude: ['createdAt', 'updatedAt', 'driverId'] },
        through: {
          attributes: [],
        },
        include: [
          {
            model: REF_VehicleScheduleStatus,
            as: 'status',
            attributes: ['name'],
          },
          {
            model: TPT_Vehicle,
            as: 'vehicle',
            attributes: ['name', 'vehicleNo', 'VehiclePlateNo', 'capacity'],
            include: [
              { model: REF_VehicleType, attributes: ['name'], as: 'type' },
              { model: TPT_Vendor, attributes: ['name'], as: 'vendor' },
            ],
          },
          {
            model: ACM_Location,
            as: 'pickUp',
            attributes: ['name', 'description', 'address', 'latitude', 'longtitude'],
          },
          {
            model: ACM_Location,
            as: 'destination',
            attributes: ['name', 'description', 'address', 'latitude', 'longtitude'],
          },
        ],
      },
    ],
  });

  if (!participantInstance) {
    return {
      success: false,
      code: 404,
      message: ['Participant Data Not Found'],
    };
  }

  participantInstance.dataValues.events = [];
  participantInstance.dataValues.transportationSchedules = [];
  participantInstance.dataValues.profileFilename = participantInstance.dataValues.file?.split('/').pop() || null;
  participantInstance.dataValues.identityFilename = participantInstance.dataValues.identityFile?.split('/').pop() || null;
  participantInstance.dataValues.baptismFilename = participantInstance.dataValues.baptismFile?.split('/').pop() || null;
  participantInstance.dataValues.referenceFilename = participantInstance.dataValues.referenceFile?.split('/').pop() || null;

  // parsing participant lodger history
  participantInstance.lodgers.forEach((lodger) => {
    lodger.room.dataValues.type = lodger.room.type.dataValues.name;
    lodger.room.dataValues.bed = lodger.room.bed.dataValues.name;
  });

  // parsing participant events
  participantInstance.groups.forEach((group) => {
    group.event.dataValues.groupId = group.dataValues.id;
    group.event.dataValues.category = group.event.category.dataValues.name;
    participantInstance.dataValues.events.push(group.event);
    delete group.dataValues.event;
  });

  // parsing participant transportation schedule
  participantInstance.TPT_VehicleSchedules.forEach((schedule) => {
    schedule.dataValues.status = schedule.status.dataValues.name;
    if (schedule.vehicle) {
      schedule.vehicle.dataValues.type = schedule.vehicle.type.dataValues.name;
      schedule.vehicle.dataValues.vendor = schedule.vehicle.vendor.dataValues.name;
    }

    participantInstance.dataValues.transportationSchedules.push(schedule);
  });
  delete participantInstance.dataValues.TPT_VehicleSchedules;

  return {
    success: true,
    message: 'Successfully Getting Participant',
    content: participantInstance,
  };
};

const searchParticipant = async (where) => {
  const participantInstance = await PAR_Participant.findAll({
    where,
    include: [
      {
        model: PAR_Contingent,
        where: where.id ? { id: where.id } : null,
        as: 'contingent',
        attributes: ['id', 'name'],
        include: { model: REF_Region, as: 'region', attributes: ['id', 'name'] },
      },
      { model: QRM_QR, as: 'qr' },
      { model: REF_CommitteeType, attributes: ['name'], as: 'committeeType' },
      { model: REF_IdentityType, attributes: ['id', 'name'], as: 'identityType' },
      { model: REF_ParticipantType, attributes: ['id', 'name'], as: 'participantType' },
      {
        model: PAR_Group,
        as: 'groups',
        through: { attributes: [] },
        include: {
          model: ENV_Event,
          as: 'event',
          attributes: { exclude: ['picId', 'createdAt', 'updatedAt'] },
          include: [
            { model: REF_EventCategory, attributes: ['name'], as: 'category' },
            {
              model: ACM_Location,
              attributes: ['parentLocationId', 'name', 'address'],
              as: 'location',
            },
          ],
        },
      },
      { model: PAR_ParticipantTracking, as: 'history' },
      {
        model: ACM_ParticipantLodger,
        as: 'lodgers',
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'participantId'] },
        include: {
          model: ACM_Room,
          as: 'room',
          attributes: ['typeId', 'locationId', 'name', 'floor'],
          include: [
            { model: REF_RoomType, attributes: ['name'], as: 'type' },
            {
              model: ACM_Location,
              attributes: ['parentLocationId', 'name', 'address'],
              as: 'location',
            },
          ],
        },
      },
      {
        model: TPT_VehicleSchedule,
        attributes: { exclude: ['createdAt', 'updatedAt', 'driverId'] },
        through: {
          attributes: [],
        },
        include: [
          {
            model: REF_VehicleScheduleStatus,
            as: 'status',
            attributes: ['name'],
          },
          {
            model: TPT_Vehicle,
            as: 'vehicle',
            attributes: ['name', 'vehicleNo', 'VehiclePlateNo', 'capacity'],
            include: [
              { model: REF_VehicleType, attributes: ['name'], as: 'type' },
              { model: TPT_Vendor, attributes: ['name'], as: 'vendor' },
            ],
          },
          {
            model: ACM_Location,
            as: 'pickUp',
            attributes: ['name', 'description', 'address', 'latitude', 'longtitude'],
          },
          {
            model: ACM_Location,
            as: 'destination',
            attributes: ['name', 'description', 'address', 'latitude', 'longtitude'],
          },
        ],
      },
    ],
  });

  if (!participantInstance) {
    return {
      success: false,
      code: 404,
      message: ['Participant Data Not Found'],
    };
  }

  // participantInstance.dataValues.events = [];
  // participantInstance.dataValues.transportationSchedules = [];

  // // parsing participant lodger history
  // participantInstance.lodgers.forEach((lodger) => {
  //   lodger.room.dataValues.type = lodger.room.type.dataValues.name;
  // });

  // // parsing participant events
  // participantInstance.groups.forEach((group) => {
  //   group.event.dataValues.groupId = group.dataValues.id;
  //   group.event.dataValues.category = group.event.category.dataValues.name;
  //   // participantInstance.dataValues.events.push(group.event);
  //   delete group.dataValues.event;
  // });

  // // parsing participant transportation schedule
  // participantInstance.TPT_VehicleSchedules.forEach((schedule) => {
  //   schedule.dataValues.status = schedule.status.dataValues.name;
  //   if (schedule.vehicle) {
  //     schedule.vehicle.dataValues.type = schedule.vehicle.type.dataValues.name;
  //     schedule.vehicle.dataValues.vendor = schedule.vehicle.vendor.dataValues.name;
  //   }

  //   participantInstance.dataValues.transportationSchedules.push(schedule);
  // });
  // delete participantInstance.dataValues.TPT_VehicleSchedules;

  return {
    success: true,
    message: 'Successfully Getting Participant',
    content: participantInstance,
  };
};

const validateParticipantInputs = async (form, files, id, where) => {
  const {
    contingentId,
    typeId,
    identityTypeId,
    name,
    gender,
    birthDate,
    identityNo,
    phoneNbr,
    email,
    address,
  } = form;

  const invalid400 = [];
  const invalid404 = [];

  // check contingent id validity
  const contingentInstance = await PAR_Contingent.findByPk(contingentId);
  if (!contingentInstance) {
    invalid404.push('Contingent Data Not Found');
  }

  if (where?.id && where.id !== Number(contingentId)) {
    return {
      isValid: false,
      code: 400,
      message: ['Prohibited To Create Participant For Other Contingent'],
    };
  }

  // check participant type id validity
  const participantTypeInstance = await REF_ParticipantType.findByPk(typeId);
  if (!participantTypeInstance) {
    invalid404.push('Participant Type Data Not Found');
  }

  // check identity type id validity
  const identityTypeInstance = await REF_IdentityType.findByPk(identityTypeId);
  if (!identityTypeInstance) {
    invalid404.push('Identity Type Data Not Found');
  }

  let filePath = null;
  let identityFilePath = null;
  let baptismFilePath = null;
  let referenceFilePath = null;
  Object.values(files).forEach(async (file) => {
    if (file[0].fieldname === 'participantImage') {
      if (!['png', 'jpeg', 'jpg'].includes(file[0].originalname.split('.').pop())) {
        invalid400.push('Upload only supports file types [png, jpeg, and jpg]');
      }

      const maxSizeInByte = 3000000;
      if (file[0].size > maxSizeInByte) {
        invalid400.push('The file size exceeds the maximum size limit of 3 Megabyte');
      }

      filePath = `public/images/participants/${file[0].filename}`;
    } else {
      if (!['png', 'jpeg', 'jpg', 'pdf', 'docx'].includes(file[0].originalname.split('.').pop())) {
        invalid400.push('Upload only supports file types [png, jpeg, and jpg]');
      }

      let format = 'images';
      if (['pdf', 'docx'].includes(file[0].originalname.split('.').pop())) {
        format = 'documents';
      }

      const maxSizeInByte = 3000000;
      if (file[0].size > maxSizeInByte) {
        invalid400.push('The file size exceeds the maximum size limit of 3 Megabyte');
      }

      if (file[0].fieldname === 'identityFile') {
        identityFilePath = `private/${format}/identitys/${file[0].filename}`;
      }
      if (file[0].fieldname === 'baptismFile') {
        baptismFilePath = `private/${format}/baptisms/${file[0].filename}`;
      }
      if (file[0].fieldname === 'referenceFile') {
        referenceFilePath = `private/${format}/references/${file[0].filename}`;
      }
    }
  });

  if (id) {
    // check identity number duplicate
    const isDuplicateIdentityNo = await PAR_Participant.findOne({
      where: {
        id: { [Op.ne]: id },
        identityNo,
      },
    });
    if (isDuplicateIdentityNo) {
      invalid400.push(`Identity Number ${identityNo} Already Used In System`);
    }

    // check phone number duplicate
    const isDuplicatePhoneNo = await PAR_Participant.findOne({
      where: {
        id: { [Op.ne]: id },
        phoneNbr,
      },
    });
    if (isDuplicatePhoneNo) {
      invalid400.push(`Phone Number ${phoneNbr} Already Used In System`);
    }
  } else {
    // check identity number duplicate
    const isDuplicateIdentityNo = await PAR_Participant.findOne({ where: { identityNo } });
    if (isDuplicateIdentityNo) {
      invalid400.push(`Identity Number ${identityNo} Already Used In System`);
    }

    // check phone number duplicate
    const isDuplicatePhoneNo = await PAR_Participant.findOne({ where: { phoneNbr } });
    if (isDuplicatePhoneNo) {
      invalid400.push(`Phone Number ${phoneNbr} Already Used In System`);
    }
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
      identityFile: identityFilePath,
      baptismFile: baptismFilePath,
      referenceFile: referenceFilePath,
    },
  };
};

const createParticipant = async (form) => {
  // check maximum contingent participant
  const contingentLimit = await SYS_Configuration.findOne({
    where: { name: 'Contingent Limit' },
    attributes: ['value'],
  });
  const contingentInstance = await PAR_Contingent.findOne({
    where: { id: form.contingent?.id },
    include: { model: PAR_Participant, attributes: ['id'], as: 'participants' },
  });
  if (contingentInstance.participants.length >= Number(contingentLimit.value)) {
    return {
      success: false,
      code: 404,
      message: `Contingent Reach It's Maximum Of ${Number(contingentLimit.value)} Participants`,
    };
  }

  // Qr setup for participant
  const templateInstance = await QRM_QRTemplate.findOne({
    where: { name: { [Op.like]: '%participant%' } },
  });
  const qrInstance = await createQR(
    { templateId: templateInstance?.id || 1 },
    {
      rawFile: `public/images/qrs/qrs-${Date.now()}.png`,
      combineFile: `public/images/qrCombines/combines-${Date.now()}.png`,
    },
  );

  // creating participant
  const participantInstance = await PAR_Participant.create({
    contingentId: form.contingent?.id,
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
    identityFile: form.identityFile,
    baptismFile: form.baptismFile,
    referenceFile: form.referenceFile,
  });

  return {
    success: true,
    message: 'Participant Successfully Created',
    content: participantInstance,
  };
};

const updateParticipant = async (id, form, where) => {
  let participantInstance = null;
  if (Object.keys(where).length > 0) {
    participantInstance = await PAR_Participant.findByPk(id, {
      include: { model: PAR_Contingent, as: 'contingent', where },
    });
  } else {
    participantInstance = await PAR_Participant.findByPk(id);
  }
  if (!participantInstance) {
    return {
      success: false,
      code: 404,
      message: ['Participant Data Not Found'],
    };
  }

  // delete old file when user want to change it
  if (form.file && participantInstance.file) {
    console.log('deleting photo participant');
    await deleteFile(relative(__dirname, participantInstance.file));
  }
  if (form.identityFile && participantInstance.identityFile) {
    console.log('deleting identity participant');
    await deleteFile(relative(__dirname, participantInstance.identityFile));
  }
  if (form.baptismFile && participantInstance.baptismFile) {
    console.log('deleting baptism participant');
    await deleteFile(relative(__dirname, participantInstance.baptismFile));
  }
  if (form.referenceFile && participantInstance.referenceFile) {
    console.log('deleting reference participant');
    await deleteFile(relative(__dirname, participantInstance.referenceFile));
  }

  participantInstance.contingetId = form.contingent?.id || null;
  participantInstance.typeId = form.participantType?.id || null;
  participantInstance.identityTypeId = form.identityType?.id || null;
  participantInstance.name = form.name;
  participantInstance.gender = form.gender;
  participantInstance.birthDate = form.birthDate;
  participantInstance.identityNo = form.identityNo;
  participantInstance.phoneNbr = form.phoneNbr;
  participantInstance.email = form.email;
  participantInstance.address = form.address;
  participantInstance.file = form.file || participantInstance.file;
  participantInstance.identityFile = form.identityFile || participantInstance.identityFile;
  participantInstance.baptismFile = form.baptismFile || participantInstance.baptismFile;
  participantInstance.referenceFile = form.referenceFile || participantInstance.referenceFile;
  await participantInstance.save();

  return {
    success: true,
    message: 'Participant Successfully Updated',
    content: participantInstance,
  };
};

const deleteParticipant = async (where) => {
  // check participant id validity

  const participantInstance = await PAR_Participant.findOne({ where });
  if (!participantInstance) {
    return {
      success: false,
      code: 404,
      message: ['Participant Data Not Found'],
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

  if (!qrInstance) {
    return {
      success: false,
      code: 404,
      message: ['QR Data Not Found'],
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
    success: true,
    message: 'Praticipant Track Successfully Created',
    content: trackInstance,
  };
};

const createParticipantViaImport = async (file) => {
  if (!['xlsx'].includes(file.originalname.split('.')[1])) {
    return {
      success: false,
      code: 400,
      message: ['Upload only supports file types [xlsx]'],
    };
  }

  const participantTypes = await REF_ParticipantType.findAll({ attributes: ['id', 'name'] });
  const identityTypes = await REF_IdentityType.findAll({ attributes: ['id', 'name'] });
  const contignets = await PAR_Contingent.findAll({ attributes: ['id', 'name'] });
  const existingParticipants = await PAR_Participant.findAll({
    attributes: ['identityTypeId', 'identityNo', 'phoneNbr', 'email'],
  });

  const existPhoneNbr = existingParticipants.map((participant) => participant.phoneNbr);
  const existEmail = existingParticipants.map((participant) => participant.email);
  const existIdentity = existingParticipants.map(
    (participant) => `${participant.identityTypeId}-${participant.identityNo}`,
  );

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

  const invalidData = [];
  await Promise.all(
    participants.map(async (participant, index) => {
      // check if participant have duplicate data with phoneNbr, email, identityNo
      if (existPhoneNbr.includes(participant.phoneNbr)) {
        invalidData.push(
          `Duplicate phone number ${participant.phoneNbr} for participant ${
            participant.name
          } at row ${index + 1}`,
        );
        return;
      }
      if (existIdentity.includes(`${participant.identityTypeId}-${participant.identityNo}`)) {
        invalidData.push(
          `Duplicate identity number ${participant.identityNo} with type ${
            participant.identityTypeId
          } for committee ${participant.name} at row ${index + 1}`,
        );
        return;
      }

      // validate participant inputs
      const inputs = await validateParticipantInputs(participant);
      if (!inputs.isValid && inputs.code === 404) {
        invalidData.push(`${inputs.message} at row ${index + 1}`);
        return;
      }
      if (!inputs.isValid && inputs.code === 400) {
        invalidData.push(`${inputs.message} at row ${index + 1}`);
        return;
      }

      // create participant and
      // register new participant email, phoneNbr, and identityNo To Exist Array
      await createParticipant(inputs.form);
      existEmail.push(participant.email);
      existPhoneNbr.push(participant.phoneNbr);
      existIdentity.push(participant.identityNo);
    }),
  );

  return {
    success: true,
    message: 'Praticipant Successfully Created In Bulk Via Import',
    content: invalidData,
  };
};

const validateCommitteeInputs = async (form, file, id) => {
  const {
    committeeTypeId,
    identityTypeId,
    name,
    gender,
    birthDate,
    identityNo,
    phoneNbr,
    email,
    address,
  } = form;

  const invalid400 = [];
  const invalid404 = [];

  const committeeTypeInstance = await REF_CommitteeType.findByPk(committeeTypeId);
  if (!committeeTypeInstance) {
    invalid404.push('Committee Type Data Not Found');
  }

  // check identity type id validity
  const identityTypeInstance = await REF_IdentityType.findByPk(identityTypeId);
  if (!identityTypeInstance) {
    invalid404.push('Identity Type Data Not Found');
  }

  let filePath = null;
  if (file) {
    if (!['png', 'jpeg', 'jpg'].includes(file.originalname.split('.')[1])) {
      invalid400.push('Upload only supports file types [png, jpeg, and jpg]');
    }

    const imageBuffer = await fs.readFile(file.path);
    const maxSizeInByte = 2000000;
    if (imageBuffer.length > maxSizeInByte) {
      invalid400.push('The file size exceeds the maximum size limit of 2 Megabyte');
    }

    filePath = `public/images/committees/${file.filename}`;
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
      invalid400.push(`Identity Number ${identityNo} Already Used In System`);
    }

    // check phone number duplicate
    const isDuplicatePhoneNo = await PAR_Participant.findOne({
      where: {
        id: { [Op.ne]: id },
        phoneNbr,
      },
    });
    if (isDuplicatePhoneNo) {
      invalid400.push(`Phone Number ${phoneNbr} Already Used In System`);
    }
  } else {
    // check identity number duplicate
    const isDuplicateIdentityNo = await PAR_Participant.findOne({ where: { identityNo } });
    if (isDuplicateIdentityNo) {
      invalid400.push(`Identity Number ${identityNo} Already Used In System`);
    }

    // check phone number duplicate
    const isDuplicatePhoneNo = await PAR_Participant.findOne({ where: { phoneNbr } });
    if (isDuplicatePhoneNo) {
      invalid400.push(`Phone Number ${phoneNbr} Already Used In System`);
    }
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

  return {
    isValid: true,
    form: {
      committeeType: committeeTypeInstance,
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

const createComittee = async (form) => {
  // creating participant
  const participantInstance = await PAR_Participant.create({
    contingentId: null,
    qrId: null,
    typeId: null,
    committeeTypeId: form.committeeType.id,
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
    success: true,
    message: 'Participant Committe Successfully Created',
    content: participantInstance,
  };
};

const updateCommittee = async (id, form) => {
  const participantInstance = await PAR_Participant.findOne({ where: { id, contingentId: null } });
  if (!participantInstance) {
    return {
      success: false,
      code: 404,
      message: ['Participant Committe Data Not Found'],
    };
  }

  // delete old file when user want to change it
  if (form.file && participantInstance.file) {
    await deleteFile(relative(__dirname, participantInstance.file));
  }

  participantInstance.committeeTypeId = form.committeeType.id;
  participantInstance.identityTypeId = form.identityType.id;
  participantInstance.name = form.name;
  participantInstance.gender = form.gender;
  participantInstance.birthDate = form.birthDate;
  participantInstance.identityNo = form.identityNo.id;
  participantInstance.phoneNbr = form.phoneNbr.id;
  participantInstance.email = form.email;
  participantInstance.address = form.address;
  participantInstance.file = form.file || participantInstance.file;
  await participantInstance.save();

  return {
    success: true,
    message: 'Participant Committe Successfully Updated',
    content: participantInstance,
  };
};

const createCommitteeViaImport = async (file) => {
  if (!['xlsx'].includes(file.originalname.split('.')[1])) {
    return {
      success: false,
      code: 400,
      message: ['Upload only supports file types [xlsx]'],
    };
  }

  const identityTypes = await REF_IdentityType.findAll({ attributes: ['id', 'name'] });
  const committeeTypes = await REF_CommitteeType.findAll({ attributes: ['id', 'name'] });

  const existingParticipants = await PAR_Participant.findAll({
    attributes: ['identityTypeId', 'identityNo', 'phoneNbr', 'email'],
  });

  const existPhoneNbr = existingParticipants.map((participant) => participant.phoneNbr);
  const existEmail = existingParticipants.map((participant) => participant.email);
  const existIdentity = existingParticipants.map(
    (participant) => `${participant.identityTypeId}-${participant.identityNo}`,
  );

  const workbook = XLSX.readFile(file.path);
  const sheet = workbook.SheetNames[0];
  const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
  const participants = data.map((element) => {
    const identityType = identityTypes.find(
      (identity) => identity.name?.toLowerCase() === element.identityType?.toLowerCase(),
    );
    const committeeType = committeeTypes.find(
      (type) => type.name?.toLowerCase() === element.committeeType?.toLowerCase(),
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
      committeeTypeId: committeeType?.id || null,
    };
  });

  const invalidData = [];
  await Promise.all(
    participants.map(async (participant, index) => {
      if (existPhoneNbr.includes(participant.phoneNbr)) {
        invalidData.push(
          `Duplicate phone number ${participant.phoneNbr} for committee ${
            participant.name
          } at row ${index + 1}`,
        );
        return;
      }
      if (existIdentity.includes(`${participant.identityTypeId}-${participant.identityNo}`)) {
        invalidData.push(
          `Duplicate identity number ${participant.identityNo} with type ${
            participant.identityTypeId
          } for committee ${participant.name} at row ${index + 1}`,
        );
        return;
      }

      // validate participant inputs
      const inputs = await validateCommitteeInputs(participant);
      if (!inputs.isValid && inputs.code === 404) {
        invalidData.push(`${inputs.message} at row ${index + 1}`);
        return;
      }
      if (!inputs.isValid && inputs.code === 400) {
        invalidData.push(`${inputs.message} at row ${index + 1}`);
        return;
      }

      // create committee and
      // register new committee email, phoneNbr, and identityNo To Exist Array
      await createComittee(inputs.form);
      existEmail.push(participant.email);
      existPhoneNbr.push(participant.phoneNbr);
      existIdentity.push(participant.identityNo);
    }),
  );

  return {
    success: true,
    message: 'Praticipant Committee Successfully Created In Bulk Via Import',
    content: invalidData,
  };
};

const selectParticipantAllSchedules = async (id, where) => {
  const participantInstance = await PAR_Participant.findOne({
    where: Object.keys(where).length > 0 ? { id, contingentId: where.id } : { id },
    attributes: ['id'],
    include: {
      model: TPT_VehicleSchedule,
      attributes: { exclude: ['createdAt', 'updatedAt', 'driverId'] },
      through: {
        attributes: [],
      },
      include: [
        {
          model: REF_VehicleScheduleStatus,
          as: 'status',
          attributes: ['name'],
        },
        {
          model: TPT_Vehicle,
          as: 'vehicle',
          attributes: ['name', 'vehicleNo', 'VehiclePlateNo', 'capacity'],
          include: [
            { model: REF_VehicleType, attributes: ['name'], as: 'type' },
            { model: TPT_Vendor, attributes: ['name'], as: 'vendor' },
          ],
        },
        {
          model: ACM_Location,
          as: 'pickUp',
          attributes: ['name', 'description', 'address', 'latitude', 'longtitude'],
        },
        {
          model: ACM_Location,
          as: 'destination',
          attributes: ['name', 'description', 'address', 'latitude', 'longtitude'],
        },
      ],
    },
  });
  if (!participantInstance) {
    return {
      success: false,
      code: 404,
      message: ['Participant Data Not Found'],
    };
  }

  return {
    success: true,
    message: 'Successfully Getting Participant Transportation Schedules',
    content: participantInstance.TPT_VehicleSchedules,
  };
};

const selectAllNormalParticipants = async (where = {}) => {
  const participants = await PAR_Participant.findAll({
    where: { contingentId: { [Op.ne]: null } },
    include: [
      {
        model: PAR_Contingent,
        as: 'contingent',
        where: where.contingentId ? { id: where.contingentId } : null,
        attributes: ['name'],
        include: { model: REF_Region, as: 'region', attributes: ['name'] },
      },
      { model: QRM_QR, as: 'qr' },
      { model: REF_IdentityType, attributes: ['name'], as: 'identityType' },
      { model: REF_ParticipantType, attributes: ['name'], as: 'participantType' },
      {
        model: PAR_Group,
        as: 'groups',
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        through: { attributes: [] },
      },
    ],
  });

  // parsed retun data
  participants.forEach((participant) => {
    if (participant.contingent) {
      participant.contingent.dataValues.region = participant.contingent.region?.dataValues.name;
    }
    participant.dataValues.identityType = participant.identityType?.dataValues.name;
    participant.dataValues.participantType = participant.participantType?.dataValues.name;
  });

  return {
    success: true,
    message: 'Successfully Getting All Participant',
    content: participants,
  };
};

const selectAllCommitteeParticipants = async () => {
  const committees = await PAR_Participant.findAll({
    where: { contingentId: null },
    include: [
      { model: QRM_QR, as: 'qr' },
      { model: REF_IdentityType, attributes: ['name'], as: 'identityType' },
      { model: REF_CommitteeType, as: 'committeeType', attributes: ['name'] },
    ],
  });

  // parsed retun data
  committees.forEach((committee) => {
    committee.dataValues.identityType = committee.identityType?.dataValues.name;
    committee.dataValues.committeeType = committee.committeeType?.dataValues.name;
  });

  return {
    success: true,
    message: 'Successfully Getting All Participant',
    content: committees,
  };
};

const downloadParticipantSecretFile = async (id, file, where) => {
  const participantInstance = await PAR_Participant.findOne({
    where: where.contingentId ? { id, contingentId: where.contingentId } : { id },
    attributes: {
      exclude: [
        'qrId',
        'typeId',
        'identityId',
        'committeeTypeId',
        'name',
        'gender',
        'birthDate',
        'identityNo',
        'phoneNbr',
        'email',
        'address',
        'createdAt',
        'updatedAt',
        'deletedAt',
      ],
    },
  });
  if (!participantInstance) {
    return {
      success: false,
      code: 404,
      message: 'Participant Data Not Found',
    };
  }
  if (!Object.keys(participantInstance.dataValues).includes(file)) {
    return {
      success: false,
      code: 400,
      message: `File ${file} Doesn't Exist`,
    };
  }

  const filePath = join(__dirname, '../', participantInstance[file]);

  if (!fsn.existsSync(filePath)) {
    return {
      success: false,
      code: 400,
      message: `File ${file} Doesn't Exist`,
    };
  }

  const filename = participantInstance[file].split('/').pop();
  const fileContent = await fs.readFile(filePath);

  return {
    success: true,
    filename,
    content: fileContent,
    filePath,
  };
};

module.exports = {
  selectAllParticipant,
  selectParticipant,
  searchParticipant,
  validateParticipantInputs,
  createParticipant,
  updateParticipant,
  deleteParticipant,
  trackingParticipant,
  createParticipantViaImport,
  validateCommitteeInputs,
  createComittee,
  updateCommittee,
  createCommitteeViaImport,
  selectParticipantAllSchedules,
  selectAllNormalParticipants,
  selectAllCommitteeParticipants,
  downloadParticipantSecretFile,
  calculateAge,
};
