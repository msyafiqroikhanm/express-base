const { ACM_Location, REF_LocationType, ACM_Room, ACM_Facility, ENV_Event } = require('../models');

const selectAllLocations = async (where) => {
  const locations = await ACM_Location.findAll({
    where,
    include: {
      model: REF_LocationType,
      as: 'type',
      attributes: ['name'],
    },
  });

  return {
    success: true,
    message: 'Successfully Getting All Location ',
    content: locations,
  };
};

const selectLocation = async (where) => {
  const location = await ACM_Location.findOne({
    where,
    include: [
      {
        model: REF_LocationType,
        as: 'type',
        attributes: ['name'],
      },
    ],
  });
  if (!location) {
    return {
      success: false,
      message: 'Location  Data Not Found',
    };
  }

  return {
    success: true,
    message: 'Successfully Getting All Location ',
    content: location,
  };
};

const createLocation = async (form) => {
  const location = await ACM_Location.create(form);

  return {
    success: true,
    message: 'Location  Successfully Created',
    content: location,
  };
};

const updateLocation = async (id, form) => {
  // check identity  id validity
  const errorMessages = [];
  const Instance = await ACM_Location.findByPk(id);
  if (!Instance) {
    return {
      success: false,
      message: 'Location  Data Not Found',
    };
  }

  if (form.typeId) {
    const typeInstance = await REF_LocationType.findByPk(form.typeId);
    if (!typeInstance) {
      errorMessages.push('Location Type Not Found');
    }
  }

  if (form.parentLocationId) {
    const parentLocation = await ACM_Location.findByPk(form.parentLocationId);
    if (!parentLocation) {
      errorMessages.push('Parent Location Data Not Found');
    }
  }

  if (errorMessages.length > 0) {
    return { isValid: false, code: 404, message: errorMessages };
  }

  Instance.parentLocationId = form.parentLocationId
    ? form.parentLocationId
    : Instance.parentLocationId;
  Instance.typeId = form.typeId ? form.typeId : Instance.typeId;
  Instance.name = form.name ? form.name : Instance.name;
  Instance.description = form.description ? form.description : Instance.description;
  Instance.address = form.address ? form.description : Instance.address;
  Instance.phoneNbr = form.phoneNbr ? form.phoneNbr : Instance.phoneNbr;
  Instance.latitude = form.latitude ? form.latitude : Instance.latitude;
  Instance.longtitude = form.longtitude ? form.longtitude : Instance.longtitude;
  await Instance.save();

  return {
    success: true,
    message: 'Location  Successfully Updated',
    content: Instance,
  };
};

const deleteLocation = async (id) => {
  // check identity  id validity
  const Instance = await ACM_Location.findByPk(id);
  if (!Instance) {
    return {
      success: false,
      message: 'Location  Data Not Found',
    };
  }

  //* Checking dependencies
  //   const errorMessages = [];

  //* Room
  await ACM_Room.update(
    { locationId: null },
    {
      where: {
        locationId: id,
      },
    },
  );

  //* Facilities
  await ACM_Facility.update(
    { locationId: null },
    {
      where: {
        locationId: id,
      },
    },
  );

  //* Event
  await ENV_Event.update(
    { locationId: null },
    {
      where: {
        locationId: id,
      },
    },
  );

  const { name } = Instance.dataValues;

  await Instance.destroy();

  return {
    success: true,
    message: 'Location  Successfully Deleted',
    content: `Location  ${name} Successfully Deleted`,
  };
};

const validateLocationInputs = async (form) => {
  const errorMessages = [];

  const typeInstance = await REF_LocationType.findByPk(form.typeId);
  if (!typeInstance) {
    errorMessages.push('Location Type Not Found');
  }

  if (form.parentLocationId) {
    const parentLocation = await ACM_Location.findByPk(form.parentLocationId);
    if (!parentLocation) {
      errorMessages.push('Parent Location Data Not Found');
    }
  }

  if (errorMessages.length > 0) {
    return { isValid: false, code: 404, message: errorMessages };
  }

  return {
    isValid: true,
    form: {
      parentLocationId: form.parentLocationId,
      typeId: typeInstance.id,
      picId: form.picId,
      name: form.name,
      description: form.description,
      address: form.address,
      phoneNbr: form.phoneNbr,
      latitude: form.latitude,
      longtitude: form.longtitude,
    },
  };
};

module.exports = {
  selectAllLocations,
  selectLocation,
  createLocation,
  updateLocation,
  deleteLocation,
  validateLocationInputs,
};
