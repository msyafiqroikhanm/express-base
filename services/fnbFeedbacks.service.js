/* eslint-disable no-param-reassign */
const { FNB_Feedback, Sequelize, sequelize } = require('../models');

const summaryFNBFeedbackByContingent = async (where) => {
  const fnbFeedback = await FNB_Feedback.findAll({
    where,
    attributes: [
      // 'eventName',
      // 'name',
      'contingent',
      [Sequelize.fn('count', Sequelize.col('deliciousness')), 'countData'],
      [Sequelize.fn('sum', Sequelize.col('deliciousness')), 'deliciousness_sum'],
      [Sequelize.fn('avg', Sequelize.col('deliciousness')), 'deliciousness_avg'],
      [Sequelize.fn('sum', Sequelize.col('combination')), 'combination_sum'],
      [Sequelize.fn('avg', Sequelize.col('combination')), 'combination_avg'],
      [Sequelize.fn('sum', Sequelize.col('suitability')), 'suitability_sum'],
      [Sequelize.fn('avg', Sequelize.col('suitability')), 'suitability_avg'],
      [Sequelize.fn('sum', Sequelize.col('arrangement')), 'arrangement_sum'],
      [Sequelize.fn('avg', Sequelize.col('arrangement')), 'arrangement_avg'],
      [Sequelize.fn('sum', Sequelize.col('appearance')), 'appearance_sum'],
      [Sequelize.fn('avg', Sequelize.col('appearance')), 'appearance'],
      [Sequelize.fn('sum', Sequelize.col('cleanliness')), 'cleanliness_sum'],
      [Sequelize.fn('avg', Sequelize.col('cleanliness')), 'cleanliness_avg'],
      [Sequelize.fn('sum', Sequelize.col('aroma')), 'aroma_sum'],
      [Sequelize.fn('avg', Sequelize.col('aroma')), 'aroma_avg'],
      [Sequelize.fn('sum', Sequelize.col('freshness')), 'freshness_sum'],
      [Sequelize.fn('avg', Sequelize.col('freshness')), 'freshness_avg'],
      [
        Sequelize.literal(
          'SUM(deliciousness + combination + suitability + arrangement + appearance + cleanliness + aroma + freshness)',
        ),
        'total_sum',
      ],
      [
        Sequelize.literal(
          'SUM(deliciousness + combination + suitability + arrangement + appearance + cleanliness + aroma + freshness) / 8',
        ),
        'total_avg',
      ],
    ],
    group: 'contingent',
  });

  const allSummary = await FNB_Feedback.findAll({
    where,
    attributes: [
      // 'eventName',
      // 'name',
      'contingent',
      [Sequelize.fn('count', Sequelize.col('deliciousness')), 'countData'],
      [Sequelize.fn('sum', Sequelize.col('deliciousness')), 'deliciousness_sum'],
      [Sequelize.fn('avg', Sequelize.col('deliciousness')), 'deliciousness_avg'],
      [Sequelize.fn('sum', Sequelize.col('combination')), 'combination_sum'],
      [Sequelize.fn('avg', Sequelize.col('combination')), 'combination_avg'],
      [Sequelize.fn('sum', Sequelize.col('suitability')), 'suitability_sum'],
      [Sequelize.fn('avg', Sequelize.col('suitability')), 'suitability_avg'],
      [Sequelize.fn('sum', Sequelize.col('arrangement')), 'arrangement_sum'],
      [Sequelize.fn('avg', Sequelize.col('arrangement')), 'arrangement_avg'],
      [Sequelize.fn('sum', Sequelize.col('appearance')), 'appearance_sum'],
      [Sequelize.fn('avg', Sequelize.col('appearance')), 'appearance'],
      [Sequelize.fn('sum', Sequelize.col('cleanliness')), 'cleanliness_sum'],
      [Sequelize.fn('avg', Sequelize.col('cleanliness')), 'cleanliness_avg'],
      [Sequelize.fn('sum', Sequelize.col('aroma')), 'aroma_sum'],
      [Sequelize.fn('avg', Sequelize.col('aroma')), 'aroma_avg'],
      [Sequelize.fn('sum', Sequelize.col('freshness')), 'freshness_sum'],
      [Sequelize.fn('avg', Sequelize.col('freshness')), 'freshness_avg'],
      [
        Sequelize.literal(
          'SUM(deliciousness + combination + suitability + arrangement + appearance + cleanliness + aroma + freshness)',
        ),
        'total_sum',
      ],
      [
        Sequelize.literal(
          'SUM(deliciousness + combination + suitability + arrangement + appearance + cleanliness + aroma + freshness) / 8',
        ),
        'total_avg',
      ],
    ],
  });

  const response = { fnbFeedback, allSummary };
  const fnbFeedbackInfo = await FNB_Feedback.findOne({});
  fnbFeedback.eventName = fnbFeedbackInfo.eventName;

  return {
    success: true,
    message: 'Successfully Getting Summary of FNB Feedback ',
    content: response,
  };
};

const summaryFNBFeedback = async (where) => {
  // const fnbFeedback = await FNB_Feedback.findOne({
  //   where,
  //   attributes: [
  //     // 'eventName',
  //     // 'name',
  //     // 'contingent',
  //     [Sequelize.fn('avg', Sequelize.col('deliciousness')), 'deliciousness'],
  //     [Sequelize.fn('avg', Sequelize.col('combination')), 'combination'],
  //     [Sequelize.fn('avg', Sequelize.col('suitability')), 'suitability'],
  //     [Sequelize.fn('avg', Sequelize.col('arrangement')), 'arrangement'],
  //     [Sequelize.fn('avg', Sequelize.col('appearance')), 'appearance'],
  //     [Sequelize.fn('avg', Sequelize.col('cleanliness')), 'cleanliness'],
  //     [Sequelize.fn('avg', Sequelize.col('aroma')), 'aroma'],
  //     [Sequelize.fn('avg', Sequelize.col('freshness')), 'freshness'],
  //   ],
  // });

  // const fnbFeedbackInfo = await FNB_Feedback.findOne({});
  // fnbFeedback.eventName = fnbFeedbackInfo.eventName;
  const fnbFeedback = {
    eventName: '',
    deliciousness: 0,
    combination: 0,
    suitability: 0,
    arrangement: 0,
    appearance: 0,
    cleanliness: 0,
    aroma: 0,
    freshness: 0,
    totalAvg: 0,
  };

  const fnbFeedbacks = await FNB_Feedback.findAll({ where });
  if (fnbFeedbacks.length) {
    fnbFeedbacks.forEach((feedback) => {
      fnbFeedback.eventName = feedback.eventName;
      fnbFeedback.deliciousness += feedback.deliciousness;
      fnbFeedback.combination += feedback.combination;
      fnbFeedback.suitability += feedback.suitability;
      fnbFeedback.arrangement += feedback.arrangement;
      fnbFeedback.appearance += feedback.appearance;
      fnbFeedback.cleanliness += feedback.cleanliness;
      fnbFeedback.aroma += feedback.aroma;
      fnbFeedback.freshness += feedback.freshness;
      fnbFeedback.totalAvg =
        fnbFeedback.totalAvg +
        feedback.deliciousness +
        feedback.combination +
        feedback.suitability +
        feedback.arrangement +
        feedback.appearance +
        feedback.cleanliness +
        feedback.aroma +
        feedback.freshness;
    });

    fnbFeedback.deliciousness /= fnbFeedbacks.length;
    fnbFeedback.combination /= fnbFeedbacks.length;
    fnbFeedback.suitability /= fnbFeedbacks.length;
    fnbFeedback.arrangement /= fnbFeedbacks.length;
    fnbFeedback.appearance /= fnbFeedbacks.length;
    fnbFeedback.cleanliness /= fnbFeedbacks.length;
    fnbFeedback.aroma /= fnbFeedbacks.length;
    fnbFeedback.freshness /= fnbFeedbacks.length;
    fnbFeedback.totalAvg /= fnbFeedbacks.length;
  }

  return {
    success: true,
    message: 'Successfully Getting Summary of FNB Feedback ',
    content: fnbFeedback,
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
  summaryFNBFeedbackByContingent,
};
