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

  after(async () => {
    await models.Exams.destroy({ truncate: true });
  });

});
