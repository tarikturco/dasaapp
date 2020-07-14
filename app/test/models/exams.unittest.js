const models = require('../../models');

const assert = require('assert');

describe('Exams model', () => {

  it('Should not create an exam when there is no name in the request', async () => {

    try {
      await models.Exams.create({
        type: "IMAGE"
      });
      throw new Error('There is no error');
    } catch (error) {
      assert.equal(error.name, 'SequelizeValidationError', 'The error thrown is correct');
    }

  });

  it('Should not create an exam when the name is an empty string', async () => {

    try {
      await models.Exams.create({
        name: "",
        type: "CLINICAL_ANALYSIS"
      });
      throw new Error('There is no error');
    } catch (error) {
      assert.equal(error.name, 'SequelizeValidationError', 'The error thrown is correct');
    }

  });

  it('Should not create an exam when the type is not a valid one', async () => {

    try {
      await models.Exams.create({
        name: "BLOOD EXAM",
        type: "BLOOD_EXAM"
      });
      throw new Error('There is no error');
    } catch (error) {
      assert.equal(error.name, 'SequelizeDatabaseError', 'The error thrown is correct');
    }

  });

  it('Should create an exam', async () => {

    const exam = await models.Exams.create({
      name: 'Blood exam',
      type: "CLINICAL_ANALYSIS"
    });
    assert.equal(exam.id, 1, 'The exam was created correctly');

  });

  it('Should create an exam with the default type', async () => {

    const exam = await models.Exams.create({
      name: 'ECG'
    });
    assert.equal(exam.id, 2, 'The exam was created correctly');
    assert.equal(exam.type, 'CLINICAL_ANALYSIS', 'The exam type is correct');

  });

  it('Should search exams by name', async () => {

    await models.Exams.create({ name: 'Another blood exam', type: 'CLINICAL_ANALYSIS' });

    const exams = await models.Exams.searchByName('BLOOD');

    assert.equal(exams.length, 2, 'Two exams were found');
  });

  it('Should not create an exam when there already exist one with the same name', async () => {

    try {
      await models.Exams.create({
        name: 'Blood exam',
        type: "CLINICAL_ANALYSIS"
      });
      throw new Error('There is no error');
    } catch (error) {
      assert.equal(error.name, 'SequelizeUniqueConstraintError', 'The error thrown is correct');
    }

  });

  it('Should deactivate an exam', async () => {

    const exam = await models.Exams.findByPk(1);
    assert.equal(exam.status, 'ACTIVE', 'The current status is active');

    await exam.update({ status: 'INACTIVE' });

    assert.notEqual(exam.deactivatedAt, 'deactivatedAt is not true');

    const activeExam = await models.Exams.scope('active').findByPk(1);

    assert.ok(!activeExam, 'There is no active exam with this id');

    await exam.update({ status: 'ACTIVE' });
    assert.equal(exam.status, 'INACTIVE', 'The status is still inactive (it is not possible to reactivate)');
  });

  it('Should bulk create and bulk inactivate some exams', async () => {

    const exams = [
      { name: 'Eletrocardiograma', type: 'IMAGE' },
      { name: 'Ecocardiograma', type: 'IMAGE' },
      { name: 'Exame de plaquetas', type: 'CLINICAL_ANALYSIS' },
      { name: 'Estudo do colesterol', type: 'CLINICAL_ANALYSIS' },
    ];

    const created = await models.Exams.bulkCreate(exams);

    assert.equal(created.length, 4, '4 exams were created');

    const ids = created.map((exam) => exam.id);

    await models.Exams.bulkInactivate(ids);

    const actives = await models.Exams.scope('active').findAll({ where: { id: { [models.Sequelize.Op.in]: ids } } });

    assert.equal(actives.length, 0, 'There is no active exam');
  });

  after(async () => {
    await models.Exams.destroy({ truncate: true });
  });

});
