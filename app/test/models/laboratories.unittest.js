const models = require('../../models');

const assert = require('assert');
const sinon = require('sinon');

describe('Laboratories model', () => {

  let sandbox;

  before(() => {
  });

  it('Should create a lab', async () => {
    
    await models.Laboratories.create({
      name: 'teste',
      address: "ifndjakss"
    });
    
  });

  after(() => {
  });

});
