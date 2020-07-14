const assert = require('assert');
const mock = require('mock-require');
const sinon = require('sinon');

const models = require('../../models');

describe('Laboratory controller', () => {

  let sandbox, next, findByPk, res, labController;

  before(() => {
    sandbox = sinon.createSandbox();

    next = sandbox.stub();
    res = { status: sandbox.stub(), send: sandbox.stub() };
    res.send.returns(res);
    res.status.returns(res);

    findByPk = sandbox.stub();
    mock('../../lib/findByPk', findByPk);

    sandbox.stub(models.Laboratories, 'create');
    sandbox.stub(models.Laboratories, 'bulkCreate');
    sandbox.stub(models.Laboratories, 'findAll');
    sandbox.stub(models.Laboratories, 'findByPk');
    sandbox.stub(models.Laboratories, 'bulkInactivate');

    labController = require('../../controllers/laboratories');
  });

  beforeEach(() => {
    sandbox.resetHistory();
  });

  describe('createRequest', () => {

    it('Should call next in createRequest when models.Laboratorries.create throws an error', async () => {
      const body = {};

      models.Laboratories.create.rejects('Creation error');

      await labController.createRequest({ body }, res, next);

      assert.ok(res.status.notCalled, 'res.status was not called');
      assert.ok(res.send.notCalled, 'res.send was not called');
      assert.ok(next.calledOnce, 'Next was called once');
      assert.equal(next.args[0][0], 'Creation error', 'next arg is correct');
    });

    it('Should send the lab created when there is no error in createRequest', async () => {
      const body = { name: 'Lab name', address: 'Street avenue' };

      models.Laboratories.create.resolves({ id: 7 });
      models.Laboratories.findByPk.resolves({ id: 7 });

      await labController.createRequest({ body }, res, next);

      assert.ok(res.status.calledOnce, 'res.status was called once');
      assert.equal(res.status.args[0][0], 201, 'The correct response code was sent');
      assert.ok(res.send.calledOnce, 'res.send was called once');
      assert.deepEqual(res.send.args[0][0], { id: 7 }, 'The correct response was sent');
      assert.ok(next.notCalled, 'Next was not called');
    });

    it('Should create a lab with some exams', async () => {
      const body = { name: 'Lab already associated with exams', address: 'Nowhere', examIds: [47,83] };

      const lab = { id: 53, setExams: sandbox.stub() };

      models.Laboratories.create.resolves(lab);
      models.Laboratories.findByPk.resolves({ id: 53 });

      await labController.createRequest({ body }, res, next);

      assert.ok(lab.setExams.calledOnce, 'The associatons were made');
      assert.deepEqual(lab.setExams.args, [[[47,83]]], 'The associatons were made correctly');

      assert.ok(res.status.calledOnce, 'res.status was called once');
      assert.equal(res.status.args[0][0], 201, 'The correct response code was sent');
      assert.ok(res.send.calledOnce, 'res.send was called once');
      assert.deepEqual(res.send.args[0][0], { id: 53 }, 'The correct response was sent');
      assert.ok(next.notCalled, 'Next was not called');
    });

  });

  describe('bulkCreateRequest', () => {

    it('Should call next in createRequest when models.Laboratories.bulkCreate throws an error', async () => {
      const body = { laboratories: [] };

      models.Laboratories.bulkCreate.rejects('Bulk creation error');

      await labController.createRequest({ body }, res, next);

      assert.ok(res.status.notCalled, 'res.status was not called');
      assert.ok(res.send.notCalled, 'res.send was not called');
      assert.ok(next.calledOnce, 'Next was called once');
      assert.equal(next.args[0][0], 'Bulk creation error', 'next arg is correct');
    });

    it('Should call bulkCreate when passing multiple labs in createRequest', async () => {
      const body = { laboratories: [
        { name: 'Lab 1', address: 'Address 1' },
        { name: 'Lab 2', address: 'Address 2', something: 'random' } ]
      };

      models.Laboratories.bulkCreate.resolves({ response: true });

      await labController.createRequest({ body }, res, next);

      const expectedArgs = [
        { name: 'Lab 1', address: 'Address 1' },
        { name: 'Lab 2', address: 'Address 2' }
      ];

      assert.ok(models.Laboratories.bulkCreate.calledOnce, 'bulkCreate was called once');
      assert.deepEqual(models.Laboratories.bulkCreate.args, [[expectedArgs]], 'bulkCreate was called correctly');

      assert.ok(res.status.calledOnce, 'res.status was called once');
      assert.equal(res.status.args[0][0], 201, 'The correct response code was sent');
      assert.ok(res.send.calledOnce, 'res.send was called once');
      assert.deepEqual(res.send.args[0][0], { response: true  }, 'The correct response was sent');
      assert.ok(next.notCalled, 'Next was not called');
    });

  });

  describe('updateRequest', () => {

    it('Should call next in updateRequest when findByPk throws an error', async () => {
      const params = { id: 404 };

      findByPk.rejects('Not found');

      await labController.updateRequest({ params, body: {} }, res, next);

      assert.ok(findByPk.calledOnce, 'findByPk was called once');
      assert.deepEqual(findByPk.args[0], ['Laboratories', 404], 'findByPk was called correctly');
      assert.ok(res.send.notCalled, 'res.send was not called');
      assert.ok(next.calledOnce, 'Next was called once');
      assert.equal(next.args[0][0], 'Not found', 'next arg is correct');
    });

    it('Should update the lab when calling updateRequest correctly', async () => {
      const body = { name: 'Another lab name', address: 'Another street' };
      const params = { id: 8 };
      const lab = { id: 8, update: sandbox.stub() };

      findByPk.withArgs('Laboratories', 8).resolves(lab);
      models.Laboratories.findByPk.resolves(lab);

      await labController.updateRequest({ body, params }, res, next);

      assert.ok(lab.update.calledOnce, 'The lab was updated');
      assert.deepEqual(lab.update.args[0][0], body, 'The lab was updated correctly');

      assert.ok(res.send.calledOnce, 'res.send was called once');
      assert.equal(res.send.args[0][0], lab, 'The correct response was sent');
      assert.ok(next.notCalled, 'Next was not called');
    });

    it('Should update the lab and associate it with some exams', async () => {
      const body = { address: 'Somewhere', examIds: [75,237] };
      const params = { id: 15 };

      const lab = { id: 15, update: sandbox.stub(), setExams: sandbox.stub() };

      findByPk.withArgs('Laboratories', 15).resolves(lab);
      models.Laboratories.findByPk.resolves({ id: 15 });

      await labController.updateRequest({ body, params }, res, next);

      assert.ok(lab.setExams.calledOnce, 'The associatons were made');
      assert.deepEqual(lab.setExams.args, [[[75,237]]], 'The associatons were made correctly');

      assert.ok(lab.update.calledOnce, 'The lab was updated');

      assert.ok(res.send.calledOnce, 'res.send was called once');
      assert.deepEqual(res.send.args[0][0], { id: 15 }, 'The correct response was sent');
      assert.ok(next.notCalled, 'Next was not called');
    });

  });

  describe('deleteRequest', () => {

    it('Should call next in deleteRequest when findByPk throws an error', async () => {
      const params = { id: 500 };

      findByPk.rejects('Already inactive');

      await labController.deleteRequest({ params }, res, next);

      assert.ok(findByPk.calledOnce, 'findByPk was called once');
      assert.deepEqual(findByPk.args[0], ['Laboratories', 500], 'findByPk was called correctly');
      assert.ok(res.status.notCalled, 'res.status was not called');
      assert.ok(res.send.notCalled, 'res.send was not called');
      assert.ok(next.calledOnce, 'Next was called once');
      assert.equal(next.args[0][0], 'Already inactive', 'next arg is correct');
    });

    it('Should delete the lab when calling deleteRequest correctly', async () => {
      const params = { id: 3 };
      const lab = { id: 3, update: sandbox.stub() };

      findByPk.withArgs('Laboratories', 3).resolves(lab);

      await labController.deleteRequest({ params }, res, next);

      assert.ok(lab.update.calledOnce, 'The lab was updated');
      assert.deepEqual(lab.update.args[0][0], { status: 'INACTIVE' }, 'The lab was updated correctly');

      assert.ok(res.status.calledOnce, 'res.status was called once');
      assert.equal(res.status.args[0][0], 204, 'The correct response was sent');
      assert.ok(res.send.calledOnce, 'res.send was called once');
      assert.ok(next.notCalled, 'Next was not called');
    });

  });

  describe('bulkDeleteRequest', () => {

    it('Should call next in deleteRequest when an error occurs', async () => {
      const body = { ids: [-1] };

      models.Laboratories.bulkInactivate.rejects('Some random error');

      await labController.bulkDeleteRequest({ body }, res, next);

      assert.ok(res.status.notCalled, 'res.status was not called');
      assert.ok(res.send.notCalled, 'res.send was not called');
      assert.ok(next.calledOnce, 'Next was called once');
      assert.equal(next.args[0][0], 'Some random error', 'next arg is correct');
    });

    it('Should bulk delete the laboratories by given ids', async () => {
      const body = { ids: [35,48,104] };

      models.Laboratories.bulkInactivate.withArgs([35,48,104]).resolves();

      await labController.bulkDeleteRequest({ body }, res, next);

      assert.ok(res.status.calledOnce, 'res.status was called once');
      assert.equal(res.status.args[0][0], 204, 'The correct response was sent');
      assert.ok(res.send.calledOnce, 'res.send was called once');
      assert.ok(next.notCalled, 'Next was not called');
    });

  });

  describe('readRequest', () => {

    it('Should call next in readRequest when findByPk throws an error with an id param', async () => {
      const params = { id: 404 };

      findByPk.rejects('Not found');

      await labController.readRequest({ params }, res, next);

      assert.ok(findByPk.calledOnce, 'findByPk was called once');
      assert.deepEqual(findByPk.args[0], ['Laboratories', 404, 'exams'], 'findByPk was called correctly');
      assert.ok(res.status.notCalled, 'res.status was not called');
      assert.ok(res.send.notCalled, 'res.send was not called');
      assert.ok(next.calledOnce, 'Next was called once');
      assert.equal(next.args[0][0], 'Not found', 'next arg is correct');
    });

    it('Should read an specific lab when passing an id', async () => {
      const params = { id: 6 };
      const lab = { id: 6, found: true };

      findByPk.withArgs('Laboratories', 6).resolves(lab);

      await labController.readRequest({ params }, res, next);

      assert.ok(findByPk.calledOnce, 'findByPk was called once');
      assert.ok(models.Laboratories.findAll.notCalled, 'find all labs was not called');

      assert.ok(res.send.calledOnce, 'res.send was called once');
      assert.equal(res.send.args[0][0], lab, 'res.send was called correctly');

      assert.ok(next.notCalled, 'Next was not called');
    });

    it('Should return all labs when there is no id', async () => {
      const params = {};
      const labs = [{ id: 4 }, { id: 6 }];

      models.Laboratories.findAll.resolves(labs);

      await labController.readRequest({ params }, res, next);

      assert.ok(findByPk.notCalled, 'findByPk was not called');
      assert.ok(models.Laboratories.findAll.calledOnce, 'find all labs was called once');

      assert.ok(res.send.calledOnce, 'res.send was called once');
      assert.equal(res.send.args[0][0], labs, 'res.send was called correctly');

      assert.ok(next.notCalled, 'Next was not called');
    });

  });

  after(() => {
    sandbox.restore();
    mock.stopAll();
  });

});
