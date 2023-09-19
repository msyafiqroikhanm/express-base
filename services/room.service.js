const { ACM_Location, ACM_Room, REF_RoomType, REF_RoomStatus } = require('../models');

const selectAllRooms = async (where) => {
  const rooms = await ACM_Room.findAll({
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
        model: REF_RoomStatus,
        as: 'status',
        attributes: ['id', 'name'],
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
        model: REF_RoomStatus,
        as: 'status',
        attributes: ['id', 'name'],
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

  if (form.locationId) {
    const locationInstance = await ACM_Location.findByPk(form.locationId);
    if (!locationInstance) {
      errorMessages.push('Location Data Not Found');
    }
  }

  if (form.typeId) {
    const typeInstance = await REF_RoomType.findByPk(form.typeId);
    if (!typeInstance) {
      errorMessages.push('Room Type Data Not Found');
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
  // Instance.statusId = form.statusId ? form.statusId : Instance.statusId;
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

  const { name } = Instance.dataValues;

  await Instance.destroy();

  return {
    success: true,
    message: 'Room Successfully Deleted',
    content: `Room ${name} Successfully Deleted`,
  };
};

const validateRoomInputs = async (form, where) => {
  const errorMessages = [];

  const locationInstance = await ACM_Location.findOne({ where });
  if (!locationInstance) {
    errorMessages.push('Location Data Not Found');
  }

  const typeInstance = await REF_RoomType.findByPk(form.typeId);
  if (!typeInstance) {
    errorMessages.push('Room Type Data Not Found');
  }

  const statusInstance = await REF_RoomStatus.findByPk(form.statusId);
  if (!statusInstance) {
    errorMessages.push('Room Status Data Not Found');
  }

  if (errorMessages.length > 0) {
    return { isValid: false, code: 404, message: errorMessages };
  }

  return {
    isValid: true,
    form: {
      locationId: form.locationId,
      typeId: form.typeId,
      statusId: form.statusId,
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
