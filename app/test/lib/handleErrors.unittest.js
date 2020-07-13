const assert = require('assert');
const sinon = require('sinon');

const handleErrors = require('../../lib/handleErrors');
const DasaError = require('../../lib/dasaError');

describe('HandleErrors lib', () => {
  
  let next, res, send;

  before(() => {
    next = sinon.stub();
    send = sinon.stub();
    res = {
      status: sinon.stub().returns({ send })
    };
  });
  
  beforeEach(() => {
    next.resetHistory();
    send.resetHistory();
    res.status.resetHistory();
  });

  it('Should call next when calling handleSequelizeError and the error is not a sequelize one', async () => {
    handleErrors.handleSequelizeErrors(new Error('Random error'), null, res, next);
    assert.ok(res.status.notCalled, 'res.status was not called');
    assert.ok(send.notCalled, 'res.status.send was not called');
    assert.ok(next.calledOnce, 'next was called once');
    assert.equal(next.args[0][0].message, 'Random error', 'The error is correct');
  });

  it('Should call res.status.send when calling handleSequelizeError and the error is a sequelize one', async () => {
    
    const sequelizeError = new Error('Sequelize error');
    sequelizeError.name = 'SequelizeValidationError';
    
    handleErrors.handleSequelizeErrors(sequelizeError, null, res, next);
    assert.ok(res.status.calledOnce, 'res.status was called once');
    assert.equal(res.status.args[0][0], 400, 'The correct error code was sent');
    assert.ok(send.calledOnce, 'res.status.send was called once');
    assert.deepEqual(send.args[0][0], { error: 'Sequelize error' }, 'The correct error description was sent');
    assert.ok(next.notCalled, 'next was not called');
  });

  it('Should call next when calling handleDasaError and the error is not a dasa one', async () => {
    handleErrors.handleDasaErrors(new Error('NOT_FOUND'), null, res, next);

    assert.ok(res.status.notCalled, 'res.status was not called');
    assert.ok(send.notCalled, 'res.status.send was not called');
    assert.ok(next.calledOnce, 'next was called once');
    assert.equal(next.args[0][0].message, 'NOT_FOUND', 'The error is correct');
  });

  it('Should call res.status.send when calling handleDasaError and the error is a NOT_FOUND one', async () => {
    
    const dasaError = new DasaError('entries', 'NOT_FOUND');
    
    handleErrors.handleDasaErrors(dasaError, null, res, next);
    assert.ok(res.status.calledOnce, 'res.status was called once');
    assert.equal(res.status.args[0][0], 404, 'The correct error code was sent');
    assert.ok(send.calledOnce, 'res.status.send was called once');
    assert.deepEqual(send.args[0][0], { error: 'entry not found' }, 'The correct error description was sent');
    assert.ok(next.notCalled, 'next was not called');
  });

  it('Should call res.status.send when calling handleDasaError and the error is an INACTIVE one', async () => {
    
    const dasaError = new DasaError('entries', 'INACTIVE');
    
    handleErrors.handleDasaErrors(dasaError, null, res, next);
    assert.ok(res.status.calledOnce, 'res.status was called once');
    assert.equal(res.status.args[0][0], 412, 'The correct error code was sent');
    assert.ok(send.calledOnce, 'res.status.send was called once');
    assert.deepEqual(send.args[0][0], { error: 'entry was already inactivated' }, 'The correct error description was sent');
    assert.ok(next.notCalled, 'next was not called');
  });

  it('Should call next when calling handleDasaError and the error is an unmapped DasaError', async () => {
    
    const dasaError = new DasaError('entries', 'UNMAPPED_ERROR');
    
    handleErrors.handleDasaErrors(dasaError, null, res, next);
    assert.ok(res.status.notCalled, 'res.status was not called');
    assert.ok(send.notCalled, 'res.status.send was not called');
    assert.ok(next.calledOnce, 'next was called once');
    assert.equal(next.args[0][0].message, 'UNMAPPED_ERROR', 'The error is correct');
  });

});
