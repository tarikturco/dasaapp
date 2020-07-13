const assert = require('assert');
const fs = require('fs');
const mock = require('mock-require');
const sinon = require('sinon');

const router = require('express').Route;

describe('Router', () => {

  const controller1Requests = {}, controller2Requests = {};
  let sandbox, assocRequests;

  before(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(fs, 'readdirSync').returns([
      'controller1.js',
      'controller2.js',
      'randomfile.ext'
    ]);

    ['createRequest','readRequest','updateRequest','deleteRequest', 'bulkDeleteRequest'].forEach((req) => {
      controller1Requests[req] = 'controller1 - ' + req;
      controller2Requests[req] = 'controller2 - ' + req;
    });

    // Should mock the relative path
    mock('../../controllers/controller1', controller1Requests);
    mock('../../controllers/controller2', controller2Requests);

    // Mocking express prototype functions
    sinon.stub(router.prototype, 'get');
    sinon.stub(router.prototype, 'post');
    sinon.stub(router.prototype, 'put');
    sinon.stub(router.prototype, 'delete');
  });

  it('Should create routes', async () => {

    await require('../../routes');

    // ROOT route
    const rootRoute = router.prototype.get.args[0][0];
    const send = sandbox.stub();
    rootRoute(null, { send });
    assert.ok(send.calledOnce, 'res.send was called');
    assert.equal(send.args[0][0], 'Welcome to Dasa API');

    // GET routes
    assert.equal(router.prototype.get.callCount, 5, '5 get routes are created (Including root route)');
    assert.equal(router.prototype.get.args[1][0], 'controller1 - readRequest');
    assert.equal(router.prototype.get.args[2][0], 'controller1 - readRequest');
    assert.equal(router.prototype.get.args[3][0], 'controller2 - readRequest');
    assert.equal(router.prototype.get.args[4][0], 'controller2 - readRequest');

    // POST routes
    assert.ok(router.prototype.post.calledTwice, '2 post routes are created');
    assert.equal(router.prototype.post.args[0][0], 'controller1 - createRequest');
    assert.equal(router.prototype.post.args[1][0], 'controller2 - createRequest');

    // DELETE routes
    assert.equal(router.prototype.delete.callCount, 4, '4 delete routes are created');
    assert.equal(router.prototype.delete.args[0][0], 'controller1 - bulkDeleteRequest');
    assert.equal(router.prototype.delete.args[1][0], 'controller1 - deleteRequest');
    assert.equal(router.prototype.delete.args[2][0], 'controller2 - bulkDeleteRequest');
    assert.equal(router.prototype.delete.args[3][0], 'controller2 - deleteRequest');

    // PUT routes
    assert.ok(router.prototype.put.calledTwice, '2 put routes are created');
    assert.equal(router.prototype.put.args[0][0], 'controller1 - updateRequest');
    assert.equal(router.prototype.put.args[1][0], 'controller2 - updateRequest');

  });

  after(() => {
    // Unmock
    sandbox.restore();
    mock.stopAll();
  });

});
