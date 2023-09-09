const slugify = require('slugify');
const { REF_PICType } = require('../models');

const picTypeHelper = async () => {
  const picTypes = await REF_PICType.findAll({ attributes: ['id', 'name'] });

  const types = {};
  picTypes.forEach((type) => {
    types[
      `${slugify(type.name, {
        replacement: '_',
        lower: true,
        strict: true,
      })}`
    ] = type.id;
  });

  return types;
};

module.exports = picTypeHelper;
