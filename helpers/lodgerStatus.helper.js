const slugify = require('slugify');
const { REF_LodgerStatus } = require('../models');

const lodgerHelper = async () => {
  const lodgerStatuses = await REF_LodgerStatus.findAll({ attributes: ['id', 'name'] });

  const lodgers = {};
  lodgerStatuses.forEach((feature) => {
    lodgers[
      `${slugify(feature.name, {
        replacement: '_',
        lower: true,
        strict: true,
      })}`
    ] = feature.id;
  });

  return lodgers;
};

module.exports = lodgerHelper;
