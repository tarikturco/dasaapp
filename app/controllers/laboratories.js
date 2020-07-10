const models = require('../models');

const createRequest = async (req, res) => {
  
  const { name, address } = req.body;
  // TODO: validate
  
  const lab = await models.Laboratories.create({ name, address });
  
  return res.send(lab);
};

const updateRequest = async (req, res) => {
  return res.send('Updating!');
};

const deleteRequest = async (req, res) => {
  
  const lab = await models.Laboratories.findByPk(req.params.id);
  
  if (!lab) {
    res.status(404).send({ error: 'Lab not found' });
    return;
  }
  if (lab.status == 'INACTIVE') {
    res.status(412).send({ error: 'Lab was already inactivated' });
    return;
  }
  
  await lab.update({ status: 'INACTIVE' });
  
  return res.status(204).send();
};

const readRequest = async (req, res) => {
  
  const labs = await models.Laboratories.findAll({
    where: { status: 'ACTIVE' }
  });
  
  return res.send(labs);
};

module.exports = {
  createRequest,
  updateRequest,
  deleteRequest,
  readRequest
};