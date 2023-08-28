const slugify = require('slugify');
const { USR_Feature } = require('../models');

const features = async () => {
  const allFeature = await USR_Feature.findAll({ attributes: ['id', 'name'] });

  const featureList = {};
  allFeature.forEach((feature) => {
    featureList[`${slugify(feature.name, {
      replacement: '_',
      lower: true,
      strict: true,
    })}`] = feature.id;
  });

  return featureList;
};

module.exports = features;
