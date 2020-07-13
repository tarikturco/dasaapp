const models = require('../models');
const findByPk = require('../lib/findByPk');

const createRequest = async (req, res, next) => {

  if (req.body.laboratories) {
    return bulkCreateRequest(req, res, next);
  }

  const { name, address } = req.body;

  try {
    const lab = await models.Laboratories.create({ name, address });

    return res.status(201).send(lab);
  } catch (error) {
    next(error);
  }
};

const bulkCreateRequest = async (req, res, next) => {

  const laboratories = req.body.laboratories.map((lab) => {
    return {
      name: lab.name,
      address: lab.address
    };
  });

  try {
    const labs = await models.Laboratories.bulkCreate(laboratories);

    return res.status(201).send(labs);
  } catch (error) {
    next(error);
  }
};

const updateRequest = async (req, res, next) => {

  const { name, address } = req.body;

  try {
    const lab = await findByPk('Laboratories', req.params.id);

    await lab.update({ name, address });

    return res.send(lab);
  } catch (error) {
    next(error);
  }
};

const deleteRequest = async (req, res, next) => {

  try {
    const lab = await findByPk('Laboratories', req.params.id);

    await lab.update({ status: 'INACTIVE' });

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const bulkDeleteRequest = async (req, res, next) => {

  try {
    const ids = req.body.ids;
    await models.Laboratories.bulkInactivate(ids);

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const readRequest = async (req, res, next) => {

  try {
    if (req.params.id) {

      const lab = await findByPk('Laboratories', req.params.id);

      return res.send(lab);
    }

    const labs = await models.Laboratories.scope('active').findAll();

    return res.send(labs);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRequest,
  updateRequest,
  deleteRequest,
  bulkDeleteRequest,
  readRequest
};