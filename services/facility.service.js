const { ACM_Facility, ACM_Location } = require('../models');

const selectAllFacilities = async (where) => {
  const facilityInstance = await ACM_Facility.findAll({
    where,
    include: [
      {
        model: ACM_Location,
        as: 'location',
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

const selectFacility = async (id) => {
  const locationType = await ACM_Facility.findByPk(id, {
    include: [
      {
        model: ACM_Location,
        as: 'location',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
    ],
  });
  if (!locationType) {
    return {
      success: false,
      message: 'Location Data Not Found',
    };
  }

  return {
    success: true,
    message: 'Successfully Getting Detail Location',
    content: locationType,
  };
};

const createFacility = async (form) => {
  const facilityInstance = await ACM_Facility.create(form);

  return {
    success: true,
    message: 'Facility Successfully Created',
    content: facilityInstance,
  };
};

const updateFacility = async (id, form) => {
  // check identity type id validity
  const facilityInstance = await ACM_Facility.findByPk(id);
  if (!facilityInstance) {
    return {
      success: false,
      message: 'Facility Data Not Found',
    };
  }

  const errorMessages = [];
  if (form.locationId) {
    const locationInstance = await ACM_Location.findByPk(form.locationId);
    if (!locationInstance) {
      errorMessages.push('Location Data Not Found');
    }
  }

  if (errorMessages.length > 0) {
    return { isValid: false, code: 404, message: errorMessages };
  }

  facilityInstance.locationId = form.locationId ? form.locationId : facilityInstance.locationId;
  facilityInstance.name = form.name ? form.name : facilityInstance.name;
  facilityInstance.quantity = form.quantity ? form.quantity : facilityInstance.quantity;
  await facilityInstance.save();

  return {
    success: true,
    message: 'Facility Successfully Updated',
    content: facilityInstance,
  };
};

const deleteFacility = async (id) => {
  // check identity type id validity
  const facilityInstance = await ACM_Facility.findByPk(id);
  if (!facilityInstance) {
    return {
      success: false,
      message: 'Facility Data Not Found',
    };
  }

  await facilityInstance.destroy();

  return {
    success: true,
    message: 'Facility Successfully Deleted',
    content: 'Facility Successfully Deleted',
  };
};

const validateFacilityInputs = async (form) => {
  const errorMessages = [];

  const locationInstance = await ACM_Location.findByPk(form.locationId);
  if (!locationInstance) {
    errorMessages.push('Location Data Not Found');
  }

  if (errorMessages.length > 0) {
    return { isValid: false, code: 404, message: errorMessages };
  }

  return {
    isValid: true,
    form: {
      locationId: form.locationId,
      name: form.name,
      quantity: form.quantity,
    },
  };
};

module.exports = {
  selectAllFacilities,
  selectFacility,
  validateFacilityInputs,
  createFacility,
  updateFacility,
  deleteFacility,
};
