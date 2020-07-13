const models = require('../../models');

const assert = require('assert');

describe('Laboratories model', () => {

  it('Should not create a lab when there is no name in the request', async () => {
    
    try {
      await models.Laboratories.create({
        address: "Winden"
      });
      throw new Error('There is no error');
    } catch (error) {
      assert.equal(error.name, 'SequelizeValidationError', 'The error thrown is correct');
    }
    
  });

  it('Should not create a lab when the address is an empty string', async () => {
    
    try {
      await models.Laboratories.create({
        name: "Jonas Kahnwald",
        address: ""
      });
      throw new Error('There is no error');
    } catch (error) {
      assert.equal(error.name, 'SequelizeValidationError', 'The error thrown is correct');
    }
    
  });

  it('Should create a lab', async () => {
    
    const lab = await models.Laboratories.create({
      name: 'Salomão Zoppi Alto da Lapa',
      address: "Rua Cerro Corá, 1044, Vila Romana - Alto da Lapa, São Paulo - SP, 05061-200"
    });
    assert.equal(lab.id, 1, 'The lab was created correctly');
    
  });

  it('Should not create a lab when there already exist one with the same name', async () => {
    
    try {
      await models.Laboratories.create({
        name: 'Salomão Zoppi Alto da Lapa',
        address: "Whatever street"
      });
      throw new Error('There is no error');
    } catch (error) {
      assert.equal(error.name, 'SequelizeUniqueConstraintError', 'The error thrown is correct');
    }
    
  });
  
  after(async () => {
    await models.Laboratories.destroy({ truncate: true });
  });

});
