/* eslint-disable no-param-reassign */
const {
  CSM_CustomerFeedback,
  REF_FeedbackType,
  REF_FeedbackTarget,
  REF_FeedbackStatus,
} = require('../models');

const selectAllFeedbacks = async () => {
  const data = await CSM_CustomerFeedback.findAll({
    include: [
      { model: REF_FeedbackStatus, as: 'status', attributes: ['name'] },
      { model: REF_FeedbackTarget, as: 'target', attributes: ['name'] },
      { model: REF_FeedbackType, as: 'type', attributes: ['name'] },
    ],
  });

  data.forEach((feedback) => {
    feedback.dataValues.status = feedback.status.dataValues.name;
    feedback.dataValues.target = feedback.target.dataValues.name;
    feedback.dataValues.type = feedback.type.dataValues.name;
  });

  return {
    success: true,
    message: 'Successfully Getting All Feedback',
    content: data,
  };
};

const selectFeedback = async (id) => {
  const feedbackInstance = await CSM_CustomerFeedback.findByPk(id, {
    include: [
      { model: REF_FeedbackStatus, as: 'status', attributes: ['name'] },
      { model: REF_FeedbackTarget, as: 'target', attributes: ['name'] },
      { model: REF_FeedbackType, as: 'type', attributes: ['name'] },
    ],
  });

  if (!feedbackInstance) {
    return {
      success: false,
      code: 404,
      message: ['Feedback Data Not Found'],
    };
  }

  feedbackInstance.dataValues.status = feedbackInstance.status.dataValues.name;
  feedbackInstance.dataValues.target = feedbackInstance.target.dataValues.name;
  feedbackInstance.dataValues.type = feedbackInstance.type.dataValues.name;

  return {
    success: true,
    message: 'Successfully Getting Feedback',
    content: feedbackInstance,
  };
};

const validateFeedbackInputs = async (form) => {
  const invalid400 = [];
  const invalid404 = [];
  // check feedback type
  const typeInstance = await REF_FeedbackType.findByPk(form.typeId);
  if (!typeInstance) {
    invalid404.push('Feedback Type Data Not Found');
  }

  // check feedback target
  const targetInstance = await REF_FeedbackTarget.findByPk(form.targetId);
  if (!targetInstance) {
    invalid404.push('Feedback Target Data Not Found');
  }

  // check feedback status
  const statusInstance = await REF_FeedbackStatus.findByPk(form.statusId);
  if (!statusInstance) {
    invalid404.push('Feedback Status Data Not Found');
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
      type: typeInstance,
      target: targetInstance,
      status: statusInstance,
      customerName: form.customerName || 'Anonymous',
      longtitude: form.longtitude,
      latitude: form.latitude,
      message: form.message,
    },
  };
};

const createFeedback = async (form) => {
  const {
    type, target, status, customerName, longtitude, latitude, message,
  } = form;

  const feedbackInstance = await CSM_CustomerFeedback.create({
    typeId: type.id,
    targetId: target.id,
    statusId: status.id,
    customerName,
    longtitude,
    latitude,
    message,
  });

  return {
    success: true,
    message: 'Feedback Successfully Created',
    content: feedbackInstance,
  };
};

const updateFeedback = async (form, id) => {
  const feedbackInstance = await CSM_CustomerFeedback.findByPk(id);
  if (!feedbackInstance) {
    return {
      success: false,
      code: 404,
      message: ['Feedback Data Not Found'],
    };
  }

  feedbackInstance.statusId = form.status?.id;
  await feedbackInstance.save();

  return {
    success: true,
    message: 'Feedback Successfully Updated',
    content: feedbackInstance,
  };
};

const deleteFeedback = async (id) => {
  const feedbackInstance = await CSM_CustomerFeedback.findByPk(id);
  if (!feedbackInstance) {
    return {
      success: false,
      code: 404,
      message: ['Feedback Data Not Found'],
    };
  }

  const { customerName } = feedbackInstance.dataValues;

  await feedbackInstance.destroy();

  return {
    success: true,
    message: 'Feedback from Successfully Deleted',
    content: `Feedback from ${customerName} Successfully Deleted`,
  };
};

module.exports = {
  selectAllFeedbacks,
  selectFeedback,
  validateFeedbackInputs,
  createFeedback,
  updateFeedback,
  deleteFeedback,
};
