const pluralize = require('pluralize');

const handleSequelizeErrors = (error, req, res, next) => {
  if (error.name.indexOf('Sequelize') !== 0) {
    next(error);
    return;
  }

  res.status(400).send({ error: error.message });
};

const handleDasaErrors = (error, req, res, next) => {

  if (error.name != 'DasaError') {
    next(error);
    return;
  }

  if (error.message == 'NOT_FOUND') {
    return res.status(404).send({ error: pluralize.singular(error.modelName) + ' not found' });
  }
  if (error.message == 'INACTIVE') {
    return res.status(412).send({ error: pluralize.singular(error.modelName) + ' was already inactivated' });
  }

  next(error);
};

module.exports = { handleSequelizeErrors, handleDasaErrors };