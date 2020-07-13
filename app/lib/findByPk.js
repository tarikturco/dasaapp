const DasaError = require('./dasaError');
const models = require('../models');

const findByPk = async (modelName, id, scope = false) => {

  let model = models[modelName];

  if (scope) model = model.scope(scope);

  const entry = await model.findByPk(id);

  if (!entry) {
    throw new DasaError(modelName, 'NOT_FOUND');
  }
  if (entry.status == 'INACTIVE') {
    throw new DasaError(modelName, 'INACTIVE');
  }
  return entry;
};

module.exports = findByPk;