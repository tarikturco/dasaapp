const models = require('../models');
const findByPk = require('../lib/findByPk');

const createRequest = async (req, res, next) => {
  
  const { name, address } = req.body;
  
  try {
    const lab = await models.Laboratories.create({ name, address });
  
    return res.status(201).send(lab);
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

const readRequest = async (req, res, next) => {
  
  try {
    if (req.params.id) {

      const lab = await findByPk('Laboratories', req.params.id);
    
      return res.send(lab);
    }

    const labs = await models.Laboratories.findAll({
      where: { status: 'ACTIVE' }
    });
  
    return res.send(labs);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRequest,
  updateRequest,
  deleteRequest,
  readRequest
};