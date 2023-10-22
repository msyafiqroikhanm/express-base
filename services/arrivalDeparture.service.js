/* eslint-disable no-param-reassign */
const { Op } = require('sequelize');
const { TPT_ArrivalDepartureInformation, PAR_Contingent, ACM_Location } = require('../models');

const selectAllArrivalDepartures = async (where) => {
  const data = await TPT_ArrivalDepartureInformation.findAll({
    where: where?.contingentId ? { contingentId: where.contingentId } : null,
    include: [
      { model: PAR_Contingent, attributes: ['name'], as: 'contingent' },
      { model: ACM_Location, attributes: ['name'], as: 'location' },
    ],
  });

  data.forEach((element) => {
    element.dataValues.contingent = element.contingent?.dataValues.name || null;
    element.dataValues.location = element.location?.dataValues.name || null;
  });

  return {
    success: true,
    message: 'Successfully Getting All Arrival / Departure Information',
    content: data,
  };
};

const selectArrivalDeparture = async (id, where) => {
  const data = await TPT_ArrivalDepartureInformation.findOne({
    where: where?.contingentId ? { id, contingentId: where.contingentId } : { id },
    include: [
      { model: PAR_Contingent, attributes: ['name'], as: 'contingent' },
      { model: ACM_Location, attributes: ['name'], as: 'location' },
    ],
  });
  if (!data) {
    return {
      success: false,
      code: 404,
      message: 'Arrival / Departure Information Data Not Found',
    };
  }

  data.dataValues.contingent = data.contingent?.dataValues.name || null;
  data.dataValues.location = data.location?.dataValues.name || null;

  return {
    success: true,
    message: 'Succesfully Getting All Arival / Departure Information',
    content: data,
  };
};

const validateArrivalDepartureInputs = async (form, where) => {
  const invalid400 = [];
  const invalid404 = [];

  if (where.contingentId && Number(where?.contingentId) !== Number(form.contingentId)) {
    invalid400.push('Contingent Data Not Found');
  }

  const contingentInstance = await PAR_Contingent.findByPk(form.contingentId);
  if (!contingentInstance) {
    invalid404.push('Contingent Data Not Found');
  }

  const locationInstance = await ACM_Location.findOne({ where: { name: { [Op.substring]: 'Other' } } });

  if (!['Arrival', 'Departure'].includes(form.type)) {
    invalid400.push('Type Option Either Arrival Or Departure');
  }

  if (Number(form.totalParticipant) <= 0) {
    invalid400.push('Total Participant Must Be 1 Or More');
  }

  if (new Date().getTime() > new Date(form.time).getTime()) {
    invalid400.push('Time Cannot Set In The Past');
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
      location: locationInstance,
      name: form.name,
      otherLocation: form.otherLocation,
      type: form.type,
      transportation: form.transportation,
      totalParticipant: Number(form.totalParticipant),
      time: new Date(form.time),
    },
  };
};

const createArrivalDeparture = async (form) => {
  const informationInstance = await TPT_ArrivalDepartureInformation.create({
    contingentId: form.contingent?.id || null,
    locationId: form.location?.id || null,
    name: form.name,
    type: form.type,
    transportation: form.transportation,
    otherLocation: form.otherLocation,
    totalParticipant: form.totalParticipant,
    time: form.time,
  });

  return {
    success: true,
    message: 'Arrival / Departure Successfully Created',
    content: informationInstance,
  };
};

const updateArrivalDeparture = async (form, id) => {
  const informationInstance = await TPT_ArrivalDepartureInformation.findByPk(id);
  if (!informationInstance) {
    return {
      success: false,
      code: 404,
      message: 'Arrival / Departure Information Data Not Found',
    };
  }

  informationInstance.contingentId = form.contingent?.id || null;
  informationInstance.name = form.name;
  informationInstance.type = form.type;
  informationInstance.transportation = form.transportation;
  informationInstance.otherLocation = form.otherLocation;
  informationInstance.totalParticipant = form.totalParticipant;
  informationInstance.time = form.time;
  await informationInstance.save();

  return {
    success: true,
    message: 'Arrival / Departure Successfully Created',
    content: informationInstance,
  };
};

const deleteArrivalDeparture = async (id, where) => {
  const informationInstance = await TPT_ArrivalDepartureInformation.findByPk(id);
  if (!informationInstance) {
    return {
      success: false,
      code: 404,
      message: 'Arrival / Departure Information Data Not Found',
    };
  }

  if (where.contingentId
      && Number(where.contingentId) !== Number(informationInstance.contingentId)) {
    return {
      success: false,
      code: 404,
      message: 'Arrival / Departure Information Data Not Found',
    };
  }

  const { name } = informationInstance.dataValues;

  await informationInstance.destroy();

  return {
    success: true,
    message: 'Arrival / Schedule Successfully Deleted',
    content: `Arrival / Schedule ${name} Successfully Deleted`,
  };
};

module.exports = {
  selectAllArrivalDepartures,
  selectArrivalDeparture,
  validateArrivalDepartureInputs,
  createArrivalDeparture,
  updateArrivalDeparture,
  deleteArrivalDeparture,
};
