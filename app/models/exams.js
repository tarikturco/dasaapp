'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Exams extends Model {

    static associate(models) {
      Exams.belongsToMany(models.Laboratories, { through: 'LabExams', foreignKey: 'examId' });
      Exams.addScope('laboratories', {
        include: [
          { model: sequelize.models.Laboratories, where: { status: 'ACTIVE' }, required: false }
        ]
      });
    }
  }

  Exams.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      }
    },
    type:  {
      type: DataTypes.ENUM(['CLINICAL_ANALYSIS', 'IMAGE'])
    },
    status:  {
      type: DataTypes.ENUM(['ACTIVE', 'INACTIVE'])
    },
  }, {
    sequelize,
    modelName: 'Exams',
  });

  return Exams;
};