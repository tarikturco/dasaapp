const assert = require('assert');
const mock = require('mock-require');
const sinon = require('sinon');

const models = require('../../models');

describe('Exam controller', () => {

  let sandbox, next, findByPk, res, examController;

  before(() => {
    sandbox = sinon.createSandbox();

    next = sandbox.stub();
    res = { status: sandbox.stub(), send: sandbox.stub() };
    res.send.returns(res);
    res.status.returns(res);

    findByPk = sandbox.stub();
    mock('../../lib/findByPk', findByPk);

    sandbox.stub(models.Exams, 'create');
    sandbox.stub(models.Exams, 'findAll');
    sandbox.stub(models.Exams, 'searchByName');

    examController = require('../../controllers/exams');
  });

  beforeEach(() => {
    next.resetHistory();
    findByPk.resetHistory();
    models.Exams.create.resetHistory();
    models.Exams.findAll.resetHistory();
    models.Exams.searchByName.resetHistory();
    res.send.resetHistory();
    res.status.resetHistory();
  });

  describe('createRequest', () => {

    it('Should call next in createRequest when models.Exams.create throws an error', async () => {
      const body = {};

      models.Exams.create.rejects('Creation error');

      await examController.createRequest({ body }, res, next);

      assert.ok(res.status.notCalled, 'res.status was not called');
      assert.ok(res.send.notCalled, 'res.send was not called');
      assert.ok(next.calledOnce, 'Next was called once');
      assert.equal(next.args[0][0], 'Creation error', 'next arg is correct');
    });

    it('Should send the exam created when there is no error in createRequest', async () => {
      const body = { name: 'Exam name', type: 'IMAGE' };

      models.Exams.create.resolves({ id: 3 });

      await examController.createRequest({ body }, res, next);

      assert.ok(res.status.calledOnce, 'res.status was called once');
      assert.equal(res.status.args[0][0], 201, 'The correct response code was sent');
      assert.ok(res.send.calledOnce, 'res.send was called once');
      assert.deepEqual(res.send.args[0][0], { id: 3 }, 'The correct response was sent');
      assert.ok(next.notCalled, 'Next was not called');
    });

  });

  describe('updateRequest', () => {

    it('Should call next in updateRequest when findByPk throws an error', async () => {
      const params = { id: 404 };

      findByPk.withArgs('Exams', 404).rejects('Not found');

      await examController.updateRequest({ params, body: {} }, res, next);

      assert.ok(findByPk.calledOnce, 'findByPk was called once');
      assert.ok(res.send.notCalled, 'res.send was not called');
      assert.ok(next.calledOnce, 'Next was called once');
      assert.equal(next.args[0][0], 'Not found', 'next arg is correct');
    });

    it('Should update the exam when calling updateRequest correctly', async () => {
      const body = { name: 'Another exam name', type: 'CLINICAL_ANALYSIS' };
      const params = { id: 3 };
      const exam = { id: 3, update: sandbox.stub() };

      findByPk.withArgs('Exams', 3).resolves(exam);

      await examController.updateRequest({ body, params }, res, next);

      assert.ok(exam.update.calledOnce, 'The exam was updated');
      assert.deepEqual(exam.update.args[0][0], body, 'The exam was updated correctly');

      assert.ok(res.send.calledOnce, 'res.send was called once');
      assert.equal(res.send.args[0][0], exam, 'The correct response was sent');
      assert.ok(next.notCalled, 'Next was not called');
    });

  });

  describe('deleteRequest', () => {

    it('Should call next in deleteRequest when findByPk throws an error', async () => {
      const params = { id: 500 };

      findByPk.withArgs('Exams', 500).rejects('Already inactive');

      await examController.deleteRequest({ params }, res, next);

      assert.ok(findByPk.calledOnce, 'findByPk was called once');
      assert.ok(res.status.notCalled, 'res.status was not called');
      assert.ok(res.send.notCalled, 'res.send was not called');
      assert.ok(next.calledOnce, 'Next was called once');
      assert.equal(next.args[0][0], 'Already inactive', 'next arg is correct');
    });

    it('Should delete the exam when calling deleteRequest correctly', async () => {
      const params = { id: 3 };
      const exam = { id: 3, update: sandbox.stub() };

      findByPk.withArgs('Exams', 3).resolves(exam);

      await examController.deleteRequest({ params }, res, next);

      assert.ok(exam.update.calledOnce, 'The exam was updated');
      assert.deepEqual(exam.update.args[0][0], { status: 'INACTIVE' }, 'The exam was updated correctly');

      assert.ok(res.status.calledOnce, 'res.status was called once');
      assert.equal(res.status.args[0][0], 204, 'The correct response was sent');
      assert.ok(res.send.calledOnce, 'res.send was called once');
      assert.ok(next.notCalled, 'Next was not called');
    });

  });

  describe('readRequest', () => {

    it('Should call next in readRequest when findByPk throws an error with an id param', async () => {
      const params = { id: 404 };

      findByPk.withArgs('Exams', 404).rejects('Not found');

      await examController.readRequest({ params }, res, next);

      assert.ok(findByPk.calledOnce, 'findByPk was called once');
      assert.ok(res.status.notCalled, 'res.status was not called');
      assert.ok(res.send.notCalled, 'res.send was not called');
      assert.ok(next.calledOnce, 'Next was called once');
      assert.equal(next.args[0][0], 'Not found', 'next arg is correct');
    });

    it('Should read an specific exam when passing an id', async () => {
      const params = { id: 6 };
      const exam = { id: 6, found: true };

      findByPk.withArgs('Exams', 6).resolves(exam);

      await examController.readRequest({ params }, res, next);

      assert.ok(findByPk.calledOnce, 'findByPk was called once');
      assert.ok(models.Exams.findAll.notCalled, 'find all exams was not called');
      assert.ok(models.Exams.searchByName.notCalled, 'searchByName was not called');

      assert.ok(res.send.calledOnce, 'res.send was called once');
      assert.equal(res.send.args[0][0], exam, 'res.send was called correctly');

      assert.ok(next.notCalled, 'Next was not called');
    });

    it('Should return all exams when there is no id', async () => {
      const params = {}, query = {};
      const exams = [{ id: 4 }, { id: 6 }];

      models.Exams.findAll.resolves(exams);

      await examController.readRequest({ params, query }, res, next);

      assert.ok(findByPk.notCalled, 'findByPk was not called');
      assert.ok(models.Exams.findAll.calledOnce, 'find all exams was called once');
      assert.ok(models.Exams.searchByName.notCalled, 'searchByName was not called');

      assert.ok(res.send.calledOnce, 'res.send was called once');
      assert.equal(res.send.args[0][0], exams, 'res.send was called correctly');

      assert.ok(next.notCalled, 'Next was not called');
    });

    it('Should search by name when there is a search field in query string', async () => {
      const params = { }, query = { search: 'ECG' };
      const exams = [{ id: 2, name: 'ECG' }, { id: 13, name: 'Eletrocardiograma (ecg)' }];

      models.Exams.searchByName.resolves(exams);

      await examController.readRequest({ params, query }, res, next);

      assert.ok(findByPk.notCalled, 'findByPk was not called');
      assert.ok(models.Exams.findAll.notCalled, 'find all exams was not called');
      assert.ok(models.Exams.searchByName.calledOnce, 'searchByName was called once');

      assert.ok(res.send.calledOnce, 'res.send was called once');
      assert.equal(res.send.args[0][0], exams, 'res.send was called correctly');

      assert.ok(next.notCalled, 'Next was not called');
    });

  });


  describe('readLaboratoriesRequest', () => {

    it('Should call next in readLaboratoriesRequest when findByPk throws an error with an id param', async () => {
      const params = { id: 404 };

      findByPk.withArgs('Exams', 404, 'laboratories').rejects('Not found');

      await examController.readLaboratoriesRequest({ params }, res, next);

      assert.ok(findByPk.calledOnce, 'findByPk was called once');
      assert.ok(res.status.notCalled, 'res.status was not called');
      assert.ok(res.send.notCalled, 'res.send was not called');
      assert.ok(next.calledOnce, 'Next was called once');
      assert.equal(next.args[0][0], 'Not found', 'next arg is correct');
    });

    it('Should return the exam labs correctly', async () => {
      const params = { id: 6 };
      const exam = { Laboratories: [1,4,67] };

      findByPk.withArgs('Exams', 6, 'laboratories').resolves(exam);

      await examController.readLaboratoriesRequest({ params }, res, next);

      assert.ok(findByPk.calledOnce, 'findByPk was called once');
      assert.ok(models.Exams.findAll.notCalled, 'find all exams was not called');

      assert.ok(res.send.calledOnce, 'res.send was called once');
      assert.deepEqual(res.send.args[0][0], [1,4,67], 'res.send was called correctly');

      assert.ok(next.notCalled, 'Next was not called');
    });

  });

  describe('createLaboratoriesRequest', () => {

    it('Should call next in createLaboratoriesRequest when findByPk throws an error with an id param', async () => {
      const params = { id: 404 };

      findByPk.withArgs('Exams', 404, 'laboratories').rejects('Not found');

      await examController.createLaboratoriesRequest({ params }, res, next);

      assert.ok(findByPk.calledOnce, 'findByPk was called once');

      assert.ok(res.status.notCalled, 'res.status was not called');
      assert.ok(res.send.notCalled, 'res.send was not called');
      assert.ok(next.calledOnce, 'Next was called once');
      assert.equal(next.args[0][0], 'Not found', 'next arg is correct');
    });

    it('Should associate the exam with the lab correctly', async () => {
      const params = { id: 6, associate_id: 37 };
      const exam = { id: 6, addLaboratory: sandbox.stub() };
      const lab = { id: 37 };

      findByPk.withArgs('Exams', 6, 'laboratories').resolves(exam);
      findByPk.withArgs('Laboratories', 37).resolves(lab);

      await examController.createLaboratoriesRequest({ params }, res, next);

      assert.ok(findByPk.calledTwice, 'findByPk was called twice');
      assert.ok(exam.addLaboratory.calledOnce, 'The lab was associated to the exam');
      assert.equal(exam.addLaboratory.args[0][0], lab, 'The lab was associated to the exam correctly');

      assert.ok(res.status.calledOnce, 'res.send was called once');
      assert.ok(res.send.calledOnce, 'res.send was called once');

      assert.ok(next.notCalled, 'Next was not called');
    });

  });

  describe('deleteLaboratoriesRequest', () => {

    it('Should call next in deleteLaboratoriesRequest when findByPk throws an error with an id param', async () => {
      const params = { id: 6, disassociate_id: 404 };

      findByPk.withArgs('Exams', 6, 'laboratories').resolves({ id: 6 });
      findByPk.withArgs('Laboratories', 404).rejects('Lab not found');

      await examController.deleteLaboratoriesRequest({ params }, res, next);

      assert.ok(findByPk.calledTwice, 'findByPk was called twice');

      assert.ok(res.status.notCalled, 'res.status was not called');
      assert.ok(res.send.notCalled, 'res.send was not called');
      assert.ok(next.calledOnce, 'Next was called once');

      assert.equal(next.args[0][0], 'Lab not found', 'next arg is correct');
    });

    it('Should disassociate the exam with the lab correctly', async () => {
      const params = { id: 6, disassociate_id: 37 };
      const exam = { id: 6, removeLaboratory: sandbox.stub() };
      const lab = { id: 37 };

      findByPk.withArgs('Exams', 6, 'laboratories').resolves(exam);
      findByPk.withArgs('Laboratories', 37).resolves(lab);

      await examController.deleteLaboratoriesRequest({ params }, res, next);

      assert.ok(findByPk.calledTwice, 'findByPk was called twice');
      assert.ok(exam.removeLaboratory.calledOnce, 'The lab was disassociated to the exam');
      assert.equal(exam.removeLaboratory.args[0][0], lab, 'The lab was disassociated to the exam correctly');

      assert.ok(res.status.calledOnce, 'res.send was called once');
      assert.ok(res.send.calledOnce, 'res.send was called once');

      assert.ok(next.notCalled, 'Next was not called');
    });

  });

  after(() => {
    sandbox.restore();
    mock.stopAll();
  });

});
