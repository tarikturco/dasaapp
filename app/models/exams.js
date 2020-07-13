'use strict';
const {
  Model, Op
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Exams extends Model {

    static associate(models) {
      Exams.belongsToMany(models.Laboratories, { through: 'LabExams', foreignKey: 'examId' });
      Exams.addScope('laboratories', {
        include: [
          { model: sequelize.models.Laboratories, where: { inactivatedAt: null }, required: false }
        ]
      });
      Exams.addScope('active', {
        where: { inactivatedAt: null }
      });
    }

    static searchByName(name) {
      return Exams.scope('active', 'laboratories').findAll({
        where: { name: { [Op.iLike]: `%${name}%` } }
      });
    }

    static bulkInactivate(ids) {
      return Exams.update(
        { inactivatedAt: new Date() },
        { where: { id: { [Op.in]: ids } } }
      );
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
    inactivatedAt:  {
      type: DataTypes.DATE
    },
    status: {
      type: DataTypes.VIRTUAL,
      set: function (val) {
        if (val == 'ACTIVE') {
          // It is not possible to reactivate this model
          return;
        }
        this.setDataValue('inactivatedAt', new Date());
      },
      get: function () {
        return this.getDataValue('inactivatedAt') == null ? 'ACTIVE' : 'INACTIVE';
      }
    },
  }, {
    sequelize,
    modelName: 'Exams'
  });

  return Exams;
};