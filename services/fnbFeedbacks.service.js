/* eslint-disable no-param-reassign */
const { FNB_Feedback, Sequelize } = require('../models');

const summaryFNBFeedback = async (where) => {
  const fnbfeedback = await FNB_Feedback.findOne({
    where,
    attributes: [
      // 'eventName',
      // 'name',
      // 'contingent',
      [Sequelize.fn('avg', Sequelize.col('deliciousness')), 'deliciousness'],
      [Sequelize.fn('avg', Sequelize.col('combination')), 'combination'],
      [Sequelize.fn('avg', Sequelize.col('suitability')), 'suitability'],
      [Sequelize.fn('avg', Sequelize.col('arrangement')), 'arrangement'],
      [Sequelize.fn('avg', Sequelize.col('appearance')), 'appearance'],
      [Sequelize.fn('avg', Sequelize.col('cleanliness')), 'cleanliness'],
      [Sequelize.fn('avg', Sequelize.col('aroma')), 'aroma'],
      [Sequelize.fn('avg', Sequelize.col('freshness')), 'freshness'],
    ],
  });

  const fnbfeedbackInfo = await FNB_Feedback.findOne({});
  fnbfeedback.eventName = fnbfeedbackInfo.eventName;

  return {
    success: true,
    message: 'Successfully Getting Summary of FNB Feedback ',
    content: fnbfeedback,
  };
};

const selectAllFNBFeedback = async (where) => {
  const fnbFeedbacks = await FNB_Feedback.findAll({ where });

  return {
    success: true,
    message: 'Successfully Getting Summary of FNB Feedback ',
    content: fnbFeedbacks,
  };
};

module.exports = {
  summaryFNBFeedback,
  selectAllFNBFeedback,
};
