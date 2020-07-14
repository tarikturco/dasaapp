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
        name: "Jonas Kahnwald's lab",
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

  it('Should deactivate a lab', async () => {

    const lab = await models.Laboratories.findByPk(1);
    assert.equal(lab.status, 'ACTIVE', 'The current status is active');

    await lab.update({ status: 'INACTIVE' });

    assert.notEqual(lab.deactivatedAt, 'deactivatedAt is not true');

    const activeLab = await models.Laboratories.scope('active').findByPk(1);

    assert.ok(!activeLab, 'There is no active lab with this id');

    await lab.update({ status: 'ACTIVE' });
    assert.equal(lab.status, 'INACTIVE', 'The status is still inactive (it is not possible to reactivate)');
  });

  after(async () => {
    await models.Laboratories.destroy({ truncate: true });
  });

  it('Should bulk create and bulk inactivate some labs', async () => {

    const labs = [
      { name: 'Delboni Berrini', address: 'Avenida Luis Carlos Berrini' },
      { name: 'Salomao Zoppi Angelica', address: 'Avenida Angelica' },
      { name: 'Salomao Zoppi Moema', address: 'Moema' },
      { name: 'Delboni Vila Mariana', address: 'Vila Mariana' },
    ];

    const created = await models.Laboratories.bulkCreate(labs);

    assert.equal(created.length, 4, '4 labs were created');

    const ids = created.map((lab) => lab.id);

    await models.Laboratories.bulkInactivate(ids);

    const actives = await models.Laboratories.scope('active').findAll({ where: { id: { [models.Sequelize.Op.in]: ids } } });

    assert.equal(actives.length, 0, 'There is no active lab');
  });

});
