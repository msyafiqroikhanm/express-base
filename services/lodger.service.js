/* eslint-disable no-param-reassign */
const lodgerHelper = require('../helpers/lodgerStatus.helper');
const { checkedIn, checkedOut } = require('../libraries/lodgerStatuses.lib');
const {
  REF_IdentityType,
  REF_LodgerStatus,
  ACM_Location,
  ACM_Room,
  ACM_ParticipantLodger,
  PAR_Participant,
  REF_ParticipantType,
  PAR_Contingent,
  REF_Region,
  REF_RoomType,
  REF_RoomStatus,
  REF_LocationType,
  ACM_RoomBedType,
  sequelize,
  QRM_QR,
  PAR_Group,
  REF_CommitteeType,
} = require('../models');

const selectAllLodgers = async (where) => {
  // console.log(where);
  const lodgerInstance = await ACM_ParticipantLodger.findAll({
    // where,
    order: [
      [{ model: ACM_Room, as: 'room' }, 'locationId', 'ASC'],
      ['roomId', 'ASC'],
    ],
    include: [
      {
        model: ACM_Room,
        as: 'room',
        where: where?.locationId ? { locationId: where.locationId } : null,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [
          {
            model: ACM_Location,
            as: 'location',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            include: [
              {
                model: REF_LocationType,
                as: 'type',
                attributes: { exclude: ['createdAt', 'updatedAt'] },
              },
            ],
          },
          {
            model: REF_RoomType,
            as: 'type',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
          {
            model: ACM_RoomBedType,
            as: 'bed',
            attributes: ['id', 'name'],
          },
          {
            model: REF_RoomStatus,
            as: 'status',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
        ],
      },
      {
        model: PAR_Participant,
        as: 'participant',
        where: where?.contingentId ? { contingentId: where.contingentId } : null,
        required: true,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [
          {
            model: REF_IdentityType,
            as: 'identityType',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
          {
            model: REF_ParticipantType,
            as: 'participantType',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
          {
            model: PAR_Contingent,
            as: 'contingent',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            include: {
              model: REF_Region,
              as: 'region',
              attributes: { exclude: ['createdAt', 'updatedAt'] },
            },
          },
        ],
      },
      {
        model: REF_LodgerStatus,
        as: 'status',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
    ],
  });

  return {
    success: true,
    message: 'Successfully Getting All Lodger',
    content: lodgerInstance,
  };
};

const selectAllParticipantLodger = async (query, where) => {
  const participants = await PAR_Participant.findAll({
    where: query,
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

  return {
    success: true,
    message: 'Successfully Getting All Participant',
    content: participants,
  };
};

const selectLodger = async (id, where) => {
  const lodgerInstance = await ACM_ParticipantLodger.findByPk(id, {
    include: [
      {
        model: ACM_Room,
        as: 'room',
        where,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [
          {
            model: ACM_Location,
            as: 'location',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            include: [
              {
                model: REF_LocationType,
                as: 'type',
                attributes: { exclude: ['createdAt', 'updatedAt'] },
              },
            ],
          },
          {
            model: ACM_RoomBedType,
            as: 'bed',
            attributes: ['id', 'name'],
          },
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
      {
        model: PAR_Participant,
        as: 'participant',
        required: true,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [
          {
            model: REF_IdentityType,
            as: 'identityType',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
          {
            model: REF_ParticipantType,
            as: 'participantType',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
          {
            model: PAR_Contingent,
            as: 'contingent',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            include: {
              model: REF_Region,
              as: 'region',
              attributes: { exclude: ['createdAt', 'updatedAt'] },
            },
          },
        ],
      },
      {
        model: REF_LodgerStatus,
        as: 'status',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
    ],
  });
  if (!lodgerInstance) {
    return {
      success: false,
      message: 'Participant Lodger Data Not Found',
    };
  }

  return {
    success: true,
    message: 'Successfully Getting Detail Participant Lodger',
    content: lodgerInstance,
  };
};

const createLodger = async (form) => {
  const lodgerInstance = await ACM_ParticipantLodger.create(form.lodger);
  const roomInstance = await ACM_Room.findByPk(form.lodger.roomId);

  let locationInstance;
  if (roomInstance) {
    locationInstance = await ACM_Location.findOne({
      where: { id: roomInstance.locationId },
      attributes: ['name'],
    });
  }

  lodgerInstance.location = locationInstance ? locationInstance.name : '';

  await ACM_Room.update(form.room, { where: { id: roomInstance.id } });

  return {
    success: true,
    message: 'Participant Lodger Successfully Created',
    content: lodgerInstance,
  };
};

const updateLodger = async (id, form) => {
  // check identity type id validity
  const lodgerInstance = await ACM_ParticipantLodger.findByPk(id);
  if (!lodgerInstance) {
    return {
      success: false,
      message: 'Participant Lodger Data Not Found',
    };
  }

  const errorMessages = [];
  const invalid400 = [];

  if (form.participantId) {
    const participantInstance = await ACM_Location.findByPk(form.participantId);
    if (!participantInstance) {
      errorMessages.push('Participant Data Not Found');
    }
    const lodgerReserved = await ACM_ParticipantLodger.findOne({
      where: { participantId: form.participantId },
    });
    if (lodgerReserved) {
      errorMessages.push('Participant Has reserved');
    }
  }

  if (form.statusId) {
    const statusInstance = await REF_LodgerStatus.findByPk(form.statusId);
    if (!statusInstance) {
      errorMessages.push('Status Data Not Found');
    }
  }

  let roomIsUpdate = false;
  let newRoom;
  if (form.roomId) {
    if (Number(form.roomId) !== Number(lodgerInstance.roomId)) {
      const roomInstance = await ACM_Room.findOne({ where: { id: form.roomId, statusId: 1 } });
      if (!roomInstance) {
        errorMessages.push('Room Data Not Found');
      }
      if (roomInstance) {
        if (!(roomInstance.occupied < roomInstance.capacity)) {
          errorMessages.push('Room is Full');
        }
      }
      roomIsUpdate = true;
      newRoom = roomInstance;
    }
  }

  if (errorMessages.length > 0) {
    return { isValid: false, code: 404, message: errorMessages };
  }

  if (form.reservationOut && form.reservationIn) {
    if (new Date(form.reservationOut).getTime() < new Date(form.reservationIn).getTime()) {
      invalid400.push('Reservation out cannot be earlier than reservation in');
    }
  } else if (form.reservationOut && !form.reservationIn) {
    if (
      new Date(form.reservationOut).getTime() < new Date(lodgerInstance.reservationIn).getTime()
    ) {
      invalid400.push('Reservation out cannot be earlier than reservation in');
    }
  }

  if (invalid400.length > 0) {
    return { isValid: false, code: 400, message: invalid400 };
  }
  // const oldRoom = await ACM_Room.findByPk(lodgerHelper.roomId);

  console.log(roomIsUpdate);
  if (roomIsUpdate) {
    // * Old Room
    await ACM_Room.update(
      { statusId: 1, occupied: sequelize.literal('occupied - 1') },
      { where: { id: lodgerInstance.roomId } },
    );
    // await ACM_Room.decrement('occupied', { by: 1, where: { id: lodgerInstance.roomId } });

    // * New Room
    const formRoom = {
      occupied: newRoom.occupied + 1,
      statusId: newRoom.statusId,
    };

    if (Number(newRoom.capacity) === Number(newRoom.occupied) + 1) {
      formRoom.statusId = 2;
    }

    await ACM_Room.update(formRoom, { where: { id: newRoom.id } });
    // await ACM_Room.increment('occupied', { by: 1, where: { id: form.roomId } });
  }

  lodgerInstance.participantId = form.participantId
    ? form.participantId
    : lodgerInstance.participantId;
  lodgerInstance.roomId = form.roomId ? form.roomId : lodgerInstance.roomId;
  lodgerInstance.statusId = form.statusId ? form.statusId : lodgerInstance.statusId;
  lodgerInstance.reservationIn = form.reservationIn
    ? form.reservationIn
    : lodgerInstance.reservationIn;
  lodgerInstance.reservationOut = form.reservationOut
    ? form.reservationOut
    : lodgerInstance.reservationOut;
  lodgerInstance.checkIn = form.checkIn ? form.checkIn : lodgerInstance.checkIn;
  lodgerInstance.checkout = form.checkout ? form.checkout : lodgerInstance.checkout;

  await lodgerInstance.save();

  return {
    success: true,
    message: 'Participant Lodger Successfully Updated',
    content: lodgerInstance,
  };
};

const checkinLodger = async (id, form) => {
  // check identity type id validity
  const lodgerInstance = await ACM_ParticipantLodger.findByPk(id);
  if (!lodgerInstance) {
    return {
      success: false,
      code: 404,
      message: 'Participant Lodger Data Not Found',
    };
  }

  const errorMessages = [];

  if (
    new Date(form.checkinTime).getTime() <
    new Date(`${lodgerInstance.reservationIn} 00:00:00`).getTime()
  ) {
    errorMessages.push('You are not allowed to check in before the reservation schedule');
  }

  if (errorMessages.length > 0) {
    return { isValid: false, code: 400, message: errorMessages };
  }

  const participantInstance = await PAR_Participant.findOne({
    where: { id: lodgerInstance?.participantId },
    attributes: ['name'],
  });

  lodgerInstance.checkIn = form.checkinTime;
  lodgerInstance.statusId = checkedIn;

  await lodgerInstance.save();

  lodgerInstance.participant = participantInstance?.name || null;

  return {
    success: true,
    message: 'Participant Lodger Successfully Checkin',
    content: lodgerInstance,
  };
};

const checkoutLodger = async (id, form) => {
  // check identity type id validity
  const lodgerInstance = await ACM_ParticipantLodger.findByPk(id);
  if (!lodgerInstance) {
    return {
      success: false,
      code: 404,
      message: 'Participant Lodger Data Not Found',
    };
  }

  const errorMessages = [];

  if (!lodgerInstance.checkIn) {
    errorMessages.push('You Cannot Check Out Before Check In');
  }

  if (
    new Date(form.checkoutTime).getTime() <
    new Date(`${lodgerInstance.reservationIn} 00:00:00`).getTime()
  ) {
    errorMessages.push('You are not allowed to check out before the reservation schedule');
  }

  if (errorMessages.length > 0) {
    return { isValid: false, code: 400, message: errorMessages };
  }

  const participantInstance = await PAR_Participant.findOne({
    where: { id: lodgerInstance?.participantId },
    attributes: ['name'],
  });

  lodgerInstance.checkout = form.checkoutTime;
  lodgerInstance.statusId = checkedOut;

  await lodgerInstance.save();

  lodgerInstance.participant = participantInstance?.name || null;

  return {
    success: true,
    message: 'Participant Lodger Successfully Check Out',
    content: lodgerInstance,
  };
};

const deleteLodger = async (id) => {
  const lodgerInstance = await ACM_ParticipantLodger.findByPk(id);
  if (!lodgerInstance) {
    return {
      success: false,
      message: 'Participant Lodger Data Not Found',
    };
  }

  await lodgerInstance.destroy();
  await ACM_Room.update(
    { statusId: 1, occupied: sequelize.literal('occupied - 1') },
    { where: { id: lodgerInstance.roomId } },
  );

  return {
    success: true,
    message: 'Participant Lodger Successfully Deleted',
    content: 'Participant Lodger Successfully Deleted',
  };
};

const validateLodgerInputs = async (form) => {
  const invalid404 = [];
  const invalid400 = [];

  const roomInstance = await ACM_Room.findOne({ where: { id: form.roomId, statusId: 1 } });
  if (!roomInstance) {
    invalid404.push('Room Data Not Found');
  }
  if (roomInstance) {
    if (!(roomInstance.occupied < roomInstance.capacity)) {
      invalid404.push('Room is Full');
    }
  }

  const participantInstance = await PAR_Participant.findByPk(form.participantId);
  if (!participantInstance) {
    invalid404.push('Participant Data Not Found');
  }

  const lodgerInstance = await ACM_ParticipantLodger.findOne({
    where: { participantId: form.participantId },
  });
  if (lodgerInstance) {
    invalid404.push('Participant Has reserved');
  }

  if (invalid404.length > 0) {
    return { isValid: false, code: 404, message: invalid404 };
  }

  if (new Date(form.reservationOut).getTime() < new Date(form.reservationIn).getTime()) {
    invalid400.push('Reservation out cannot be earlier than reservation in');
  }
  if (invalid400.length > 0) {
    return { isValid: false, code: 400, message: invalid400 };
  }

  const formRoom = {
    occupied: roomInstance.occupied + 1,
    statusId: roomInstance.statusId,
  };

  if (Number(roomInstance.capacity) === Number(roomInstance.occupied) + 1) {
    formRoom.statusId = 2;
  }

  const lodgerStatusReserved = await lodgerHelper().then((lodger) => [lodger.reserved]);

  return {
    isValid: true,
    form: {
      lodger: {
        participantId: form.participantId,
        statusId: lodgerStatusReserved[0],
        roomId: form.roomId,
        reservationIn: form.reservationIn,
        reservationOut: form.reservationOut,
      },
      room: formRoom,
    },
  };
};

module.exports = {
  validateLodgerInputs,
  createLodger,
  selectAllLodgers,
  selectLodger,
  updateLodger,
  deleteLodger,
  selectAllParticipantLodger,
  checkinLodger,
  checkoutLodger,
};
