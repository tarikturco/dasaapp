const models = require('../models');
const findByPk = require('../lib/findByPk');

const createRequest = async (req, res, next) => {
  
  const { name, type } = req.body;
  
  try {
    const exam = await models.Exams.create({ name, type });
  
    return res.status(201).send(exam);
  } catch (error) {
    next(error);
  }
};

const updateRequest = async (req, res, next) => {

  try {
    const exam = await findByPk('Exams', req.params.id);
    await exam.update({ name: req.body.name, type: req.body.type });
    return res.send(exam);
  } catch (error) {
    next(error);
  }
  
};

const deleteRequest = async (req, res, next) => {

  try {
    const exam = await findByPk('Exams', req.params.id);
    await exam.update({ status: 'INACTIVE' });
    
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const readRequest = async (req, res, next) => {
  
  try {
  
    if (req.params.id) {
      const exam = await findByPk('Exams', req.params.id);
      return res.send(exam);
    }
  
    const exams = await models.Exams.findAll({
      where: { status: 'ACTIVE' }
    });
  
    return res.send(exams);
  } catch (error) {
    next(error);
  }
};

const readLaboratoriesRequest = async (req, res, next) => {
  
  try {
    const exam = await findByPk('Exams', req.params.id, 'laboratories');
    
    return res.send(exam.Laboratories);
  } catch (error) {
    next(error);
  }
  
};

const createLaboratoriesRequest = async (req, res, next) => {
  
  try {
    const exam = await findByPk('Exams', req.params.id, 'laboratories');
    const lab = await findByPk('Laboratories', req.params.associate_id);
    
    await exam.addLaboratory(lab);
    res.status(201).send();
    
  } catch (error) {
    next(error);
  }
  
};
const deleteLaboratoriesRequest = async (req, res, next) => {
  
  try {
    const exam = await findByPk('Exams', req.params.id, 'laboratories');
    const lab = await findByPk('Laboratories', req.params.desassociate_id);
    
    await exam.removeLaboratory(lab);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
  
};

module.exports = {
  createRequest,
  updateRequest,
  deleteRequest,
  readRequest,
  readLaboratoriesRequest,
  createLaboratoriesRequest,
  deleteLaboratoriesRequest,
  association: 'laboratories',
};