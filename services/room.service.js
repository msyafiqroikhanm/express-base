const {
  ACM_Location,
  ACM_Room,
  REF_RoomType,
  REF_RoomStatus,
  ACM_ParticipantLodger,
  ACM_RoomBedType,
  PAR_Participant,
  REF_LodgerStatus,
  REF_ParticipantType,
  PAR_Contingent,
} = require('../models');

const selectAllRooms = async (where) => {
  const rooms = await ACM_Room.findAll({
    where,
    order: [
      ['locationId', 'ASC'],
      ['name', 'ASC'],
    ],
    include: [
      {
        model: ACM_Location,
        as: 'location',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
      {
        model: REF_RoomType,
        as: 'type',
        attributes: ['id', 'name'],
      },
      {
        model: ACM_RoomBedType,
        as: 'bed',
        attributes: ['id', 'name'],
      },
      {
        model: REF_RoomStatus,
        as: 'status',
        attributes: ['id', 'name'],
      },
      {
        model: ACM_ParticipantLodger,
        as: 'lodger',
        attributes: ['id', 'reservationIn', 'reservationOut', 'checkIn', 'checkout'],
        include: [
          {
            model: PAR_Participant,
            as: 'participant',
            attributes: ['name', 'phoneNbr', 'email'],
          },
          {
            model: REF_LodgerStatus,
            as: 'status',
            attributes: ['id', 'name'],
          },
        ],
      },
    ],
  });

  return {
    success: true,
    message: 'Successfully Getting All Room ',
    content: rooms,
  };
};

const selectRoom = async (where) => {
  const room = await ACM_Room.findOne({
    where,
    include: [
      {
        model: ACM_Location,
        as: 'location',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
      {
        model: REF_RoomType,
        as: 'type',
        attributes: ['id', 'name'],
      },
      {
        model: ACM_RoomBedType,
        as: 'bed',
        attributes: ['id', 'name'],
      },
      {
        model: REF_RoomStatus,
        as: 'status',
        attributes: ['id', 'name'],
      },
      {
        model: ACM_ParticipantLodger,
        as: 'lodger',
        attributes: ['id', 'reservationIn', 'reservationOut', 'checkIn', 'checkout'],
        include: [
          {
            model: PAR_Participant,
            as: 'participant',
            required: true,
            attributes: ['name', 'phoneNbr', 'email'],
            include: [
              {
                model: REF_ParticipantType,
                as: 'participantType',
                attributes: ['id', 'name'],
              },
              {
                model: PAR_Contingent,
                as: 'contingent',
                attributes: ['id', 'name'],
              },
            ],
          },
          {
            model: REF_LodgerStatus,
            as: 'status',
            attributes: ['id', 'name'],
          },
        ],
      },
    ],
  });
  if (!room) {
    return {
      success: false,
      message: 'Room Data Not Found',
    };
  }

  return {
    success: true,
    message: 'Successfully Getting Room Data',
    content: room,
  };
};

const createRoom = async (form) => {
  const room = await ACM_Room.create(form);

  const locationInstance = await ACM_Location.findOne({
    where: { id: form.locationId },
    attributes: ['name'],
  });
  room.location = locationInstance.dataValues.name;

  return {
    success: true,
    message: 'Room Successfully Created',
    content: room,
  };
};

const updateRoom = async (where, form) => {
  // check identity  id validity
  const errorMessages = [];
  const Instance = await ACM_Room.findOne({ where });
  if (!Instance) {
    return {
      success: false,
      message: 'Room Data Not Found',
    };
  }
  let locationInstance = null;
  if (form.locationId) {
    locationInstance = await ACM_Location.findByPk(form.locationId);
    if (!locationInstance) {
      errorMessages.push('Location Data Not Found');
    }
  }

  if (form.typeId) {
    const typeInstance = await REF_RoomType.findByPk(form.typeId);
    if (!typeInstance) {
      errorMessages.push('Room Type Data Not Found');
    }
    if (locationInstance) {
      if (typeInstance.locationId !== locationInstance.id) {
        errorMessages.push('Prohibited To Fill Room Type For Other Location');
      }
    }
  }

  if (form.bedId) {
    const bedInstance = await ACM_RoomBedType.findByPk(form.bedId);
    if (!bedInstance) {
      errorMessages.push('Bed Type Data Not Found');
    }
    if (locationInstance && bedInstance) {
      if (bedInstance.locationId !== locationInstance.id) {
        errorMessages.push('Prohibited To Fill Bed Type From Other Location');
      }
    }
  }

  if (form.statusId) {
    const statusInstance = await REF_RoomStatus.findByPk(form.statusId);
    if (!statusInstance) {
      errorMessages.push('Room Status Data Not Found');
    }
  }

  if (errorMessages.length > 0) {
    return { isValid: false, code: 404, message: errorMessages };
  }

  Instance.locationId = form.locationId ? form.locationId : Instance.locationId;
  Instance.typeId = form.typeId ? form.typeId : Instance.typeId;
  Instance.bedId = form.bedId ? form.bedId : Instance.bedId;
  Instance.statusId = form.statusId ? form.statusId : Instance.statusId;
  Instance.name = form.name ? form.name : Instance.name;
  Instance.floor = form.floor ? form.floor : Instance.floor;
  Instance.capacity = form.capacity ? form.capacity : Instance.capacity;
  Instance.occupied = form.latitude ? form.latitude : Instance.latitude;

  await Instance.save();

  return {
    success: true,
    message: 'Room Successfully Updated',
    content: Instance,
  };
};

const deleteRoom = async (where) => {
  // check identity  id validity
  const Instance = await ACM_Room.findOne({ where });
  if (!Instance) {
    return {
      success: false,
      message: 'Room Data Not Found',
    };
  }

  //* Checking dependencies
  // ? ....
  await ACM_ParticipantLodger.destroy({ where: { roomId: Instance.id } });

  const { name } = Instance.dataValues;

  await Instance.destroy();

  return {
    success: true,
    message: 'Room Successfully Deleted',
    content: `Room ${name} Successfully Deleted`,
  };
};

const validateRoomInputs = async (form, where) => {
  const invalid404 = [];
  const invalid400 = [];

  const locationInstance = await ACM_Location.findOne({ where });
  if (!locationInstance) {
    invalid404.push('Location Data Not Found');
  }
  if (invalid404.length > 0) {
    return { isValid: false, code: 404, message: invalid404 };
  }

  //* Unique Name and Location Checking
  const roomInstanceCheck = await ACM_Room.findOne({
    where: { locationId: locationInstance.id, name: form.name },
  });
  if (roomInstanceCheck) {
    invalid400.push('Room Data Already Exists');
  }

  const typeInstance = await REF_RoomType.findByPk(form.typeId);
  if (!typeInstance) {
    invalid404.push('Room Type Data Not Found');
  }
  if (locationInstance && typeInstance) {
    if (typeInstance.locationId !== locationInstance.id) {
      invalid404.push('Prohibited To Fill Room Type From Other Location');
    }
  }

  const bedInstance = await ACM_RoomBedType.findByPk(form.bedId);
  if (!bedInstance) {
    invalid404.push('Bed Type Data Not Found');
  }

  if (locationInstance && bedInstance) {
    if (bedInstance.locationId !== locationInstance.id) {
      invalid404.push('Prohibited To Fill Bed Type From Other Location');
    }
  }

  // const statusInstance = await REF_RoomStatus.findByPk(form.statusId);
  // if (!statusInstance) {
  //   invalid404.push('Room Status Data Not Found');
  // }

  if (invalid404.length > 0) {
    return { isValid: false, code: 404, message: invalid404 };
  }
  if (invalid400.length > 0) {
    return { isValid: false, code: 400, message: invalid400 };
  }

  return {
    isValid: true,
    form: {
      locationId: form.locationId,
      typeId: typeInstance ? form.typeId : null,
      bedId: bedInstance ? form.bedId : null,
      statusId: 1,
      name: form.name,
      floor: form.floor,
      capacity: form.capacity,
      occupied: 0,
    },
  };
};

module.exports = {
  validateRoomInputs,
  selectAllRooms,
  selectRoom,
  createRoom,
  updateRoom,
  deleteRoom,
};
