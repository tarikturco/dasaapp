const assert = require('assert');
const sinon = require('sinon');

const findByPk = require('../../lib/findByPk');
const models = require('../../models');
const DasaError = require('../../lib/dasaError');

describe('FindByPk lib', () => {

  before(() => {
    models.stubbedModel = {
      scope: sinon.stub(),
      findByPk: sinon.stub()
    };

  });

  it('Should throw a not found error', async () => {
    models.stubbedModel.findByPk.resolves();

    try {
      await findByPk('stubbedModel', 23);
      throw new Error('There is no error');
    } catch (error) {
      assert.ok(error instanceof DasaError, 'The error thrown is a DasaError one');
      assert.equal(error.modelName, 'stubbedModel', 'The model name is correct');
      assert.equal(error.message, 'NOT_FOUND');
    }
  });

  it('Should throw an inactive error', async () => {
    models.stubbedModel.findByPk.resolves({ status: 'INACTIVE' });

    try {
      await findByPk('stubbedModel', 23);
      throw new Error('There is no error');
    } catch (error) {
      assert.ok(error instanceof DasaError, 'The error thrown is a DasaError one');
      assert.equal(error.modelName, 'stubbedModel', 'The model name is correct');
      assert.equal(error.message, 'INACTIVE');
    }
  });

  it('Should call findByPk and return the entry correctly', async () => {
    models.stubbedModel.findByPk.withArgs(18).resolves({ id: 18, status: 'ACTIVE' });

    const entry = await findByPk('stubbedModel', 18);
    assert.equal(entry.id, 18, 'The entry was retrieved correctly');
    assert.ok(models.stubbedModel.scope.notCalled, 'The scope method was not called');
  });

  it('Should call a scoped findByPk and return the entry correctly', async () => {
    models.stubbedModel.scope.returns(models.stubbedModel);
    models.stubbedModel.findByPk.withArgs(15).resolves({ id: 15, status: 'ACTIVE' });

    const entry = await findByPk('stubbedModel', 15, 'some scope');
    assert.equal(entry.id, 15, 'The entry was retrieved correctly');
    assert.ok(models.stubbedModel.scope.calledOnce, 'The scope method was called');
    assert.equal(models.stubbedModel.scope.args[0][0], 'some scope', 'The scope method was called correctly');
  });

  after(() => {
    delete models.stubbedModel;
  });

});
