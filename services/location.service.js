const { default: axios } = require('axios');
const { default: slugify } = require('slugify');
const {
  ACM_Location,
  REF_LocationType,
  ACM_Room,
  ACM_Facility,
  ENV_Event,
  USR_PIC,
  USR_User,
  PAR_Participant,
  REF_RoomType,
  REF_RoomStatus,
} = require('../models');

const selectAllLocations = async (where) => {
  const locations = await ACM_Location.findAll({
    where,
    include: [
      {
        model: REF_LocationType,
        as: 'type',
        attributes: ['name'],
      },
      {
        model: ACM_Location,
        as: 'childLocation',
      },
      {
        model: ACM_Room,
        as: 'rooms',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
    ],
  });

  await Promise.all(
    locations.map(async (location) => {
      const pic = await USR_PIC.findOne({
        where: { id: location.picId },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: {
          model: USR_User,
          as: 'user',
          attributes: ['id'],
          include: {
            model: PAR_Participant,
            as: 'participant',
            attributes: ['name', 'phoneNbr', 'email'],
          },
        },
      });

      // eslint-disable-next-line no-param-reassign
      location.dataValues.pic = pic.user.participant;
    }),
  );

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
      {
        model: ACM_Location,
        as: 'childLocation',
      },
      {
        model: ACM_Facility,
        as: 'facilities',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
      {
        model: ACM_Room,
        as: 'rooms',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [
          {
            model: REF_RoomType,
            as: 'type',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
          {
            model: REF_RoomStatus,
            as: 'status',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
        ],
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

const updateLocation = async (where, form) => {
  // check identity  id validity
  const errorMessages = [];
  const Instance = await ACM_Location.findOne({ where });
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

  Instance.parentLocationId = form.parentLocationId;
  Instance.typeId = form.typeId ? form.typeId : Instance.typeId;
  Instance.name = form.name ? form.name : Instance.name;
  Instance.description = form.description ? form.description : Instance.description;
  Instance.address = form.address ? form.address : Instance.address;
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

const deleteLocation = async (where) => {
  // check identity  id validity
  const Instance = await ACM_Location.findOne({ where });
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
        locationId: where.id,
      },
    },
  );

  //* Facilities
  await ACM_Facility.update(
    { locationId: null },
    {
      where: {
        locationId: where.id,
      },
    },
  );

  //* Event
  await ENV_Event.update(
    { locationId: null },
    {
      where: {
        locationId: where.id,
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

const findCoordinate = async (query) => {
  // const openstreetmapUrl = 'https://nominatim.openstreetmap.org/';
  // const coordinate = await axios({
  //   method: 'GET',
  //   url: 'https://nominatim.openstreetmap.org/search?q=aston+pluit&format=json&polygon=1&addressdetails=1',
  // });
  let q = '';
  let url = '';
  let city = '';

  if (query?.locationName) {
    q = slugify(query.locationName, '+');
    url = `https://nominatim.openstreetmap.org/search?q=${q}&format=json&polygon=1&addressdetails=1`;
  }
  if (query?.city) {
    city = slugify(query.city, '+');
    url = `https://nominatim.openstreetmap.org/search?city=${city}&format=json&polygon=1&addressdetails=1`;
  }

  if (!url) {
    url = 'https://nominatim.openstreetmap.org/search.php?city=DKI+Jakarta&format=json';
  }

  let coordinate = await axios.get(url);
  if (!coordinate.data.length) {
    coordinate = await axios.get(
      'https://nominatim.openstreetmap.org/search.php?city=DKI+Jakarta&format=json',
    );
  }

  const data = {
    name: coordinate.data[0].name,
    lat: coordinate.data[0].lat,
    lon: coordinate.data[0].lon,
  };
  console.log(JSON.stringify(coordinate.data, null, 2));

  return {
    success: true,
    message: 'Coordinate Successfully Found',
    content: data,
  };
};

module.exports = {
  selectAllLocations,
  selectLocation,
  createLocation,
  updateLocation,
  deleteLocation,
  validateLocationInputs,
  findCoordinate,
};
