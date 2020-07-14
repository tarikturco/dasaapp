const models = require('../models');
const findByPk = require('../lib/findByPk');

const createRequest = async (req, res, next) => {

  if (req.body.exams) {
    return bulkCreateRequest(req, res, next);
  }

  const { name, type } = req.body;

  try {
    const exam = await models.Exams.create({ name, type });

    if (req.body.labIds)
      await exam.setLaboratories(req.body.labIds);

    const examResponse = await models.Exams.scope('active', 'laboratories').findByPk(exam.id);

    return res.status(201).send(examResponse);
  } catch (error) {
    next(error);
  }
};

const bulkCreateRequest = async (req, res, next) => {

  const exams = req.body.exams.map((exam) => {
    return {
      name: exam.name,
      type: exam.type
    };
  });

  try {
    const response = await models.Exams.bulkCreate(exams);

    return res.status(201).send(response);
  } catch (error) {
    next(error);
  }
};

const updateRequest = async (req, res, next) => {

  try {
    const exam = await findByPk('Exams', req.params.id);
    await exam.update({ name: req.body.name, type: req.body.type });

    if (req.body.labIds)
      await exam.setLaboratories(req.body.labIds);

    const examResponse = await models.Exams.scope('active', 'laboratories').findByPk(exam.id);

    return res.send(examResponse);
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

const bulkDeleteRequest = async (req, res, next) => {

  try {
    const ids = req.body.ids;
    await models.Exams.bulkInactivate(ids);

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const readRequest = async (req, res, next) => {

  try {
    let response;

    if (req.params.id) {
      response = await findByPk('Exams', req.params.id, 'laboratories');
    } else if (req.query.search) {
      response = await models.Exams.searchByName(req.query.search);
    } else {
      response = await models.Exams.scope('active', 'laboratories').findAll();
    }

    return res.send(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRequest,
  updateRequest,
  deleteRequest,
  bulkDeleteRequest,
  readRequest,
};