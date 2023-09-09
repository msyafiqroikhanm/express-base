const lodgerHelper = require('../helpers/lodgerStatus.helper');
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
} = require('../models');

const selectAllLodgers = async (where) => {
  const facilityInstance = await ACM_ParticipantLodger.findAll({
    where,
    include: [
      {
        model: PAR_Participant,
        as: 'participant',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
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
    message: 'Successfully Getting All Facility',
    content: facilityInstance,
  };
};

const selectLodger = async (id) => {
  const lodgerInstance = await ACM_ParticipantLodger.findByPk(id, {
    include: [
      {
        model: PAR_Participant,
        as: 'participant',
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
  const lodgerInstance = await ACM_ParticipantLodger.create(form);
  const roomInstance = await ACM_Room.findByPk(form.roomId);
  roomInstance.occupied = +1;
  await roomInstance.save();

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
  if (form.roomId) {
    if (Number(form.roomId) !== Number(lodgerInstance.roomId)) {
      roomIsUpdate = true;
      const roomInstance = await ACM_Room.findByPk(form.roomId);
      if (!roomInstance) {
        errorMessages.push('Room Data Not Found');
      }
      if (roomInstance) {
        if (!(roomInstance.occupied < roomInstance.capacity)) {
          errorMessages.push('Room is Full');
        }
      }
    }
  }

  if (errorMessages.length > 0) {
    return { isValid: false, code: 404, message: errorMessages };
  }

  console.log(roomIsUpdate);
  if (roomIsUpdate) {
    // * Old Room
    await ACM_Room.decrement('occupied', { by: 1, where: { id: lodgerInstance.roomId } });

    // * New Room
    await ACM_Room.increment('occupied', { by: 1, where: { id: form.roomId } });
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

const deleteLodger = async (id) => {
  const lodgerInstance = await ACM_ParticipantLodger.findByPk(id);
  if (!lodgerInstance) {
    return {
      success: false,
      message: 'Participant Lodger Data Not Found',
    };
  }

  await lodgerInstance.destroy();
  await ACM_Room.decrement('occupied', { by: 1, where: { id: lodgerInstance.roomId } });

  return {
    success: true,
    message: 'Participant Lodger Successfully Deleted',
    content: 'Participant Lodger Successfully Deleted',
  };
};

const validateLodgerInputs = async (form) => {
  const errorMessages = [];

  const roomInstance = await ACM_Room.findByPk(form.roomId);
  if (!roomInstance) {
    errorMessages.push('Room Data Not Found');
  }
  if (roomInstance) {
    if (!(roomInstance.occupied < roomInstance.capacity)) {
      errorMessages.push('Room is Full');
    }
  }

  const participantInstance = await ACM_Location.findByPk(form.participantId);
  if (!participantInstance) {
    errorMessages.push('Participant Data Not Found');
  }

  const lodgerInstance = await ACM_ParticipantLodger.findOne({
    where: { participantId: form.participantId },
  });
  if (lodgerInstance) {
    errorMessages.push('Participant Has reserved');
  }

  if (errorMessages.length > 0) {
    return { isValid: false, code: 404, message: errorMessages };
  }

  const lodgerStatusReserved = await lodgerHelper().then((lodger) => [lodger.reserved]);

  return {
    isValid: true,
    form: {
      participantId: form.participantId,
      statusId: lodgerStatusReserved[0],
      roomId: form.roomId,
      reservationIn: form.reservationIn,
      reservationOut: form.reservationOut,
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
};
