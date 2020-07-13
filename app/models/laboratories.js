'use strict';
const {
  Model, Op
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Laboratories extends Model {

    static associate(models) {
      Laboratories.belongsToMany(models.Exams, { through: 'LabExams', foreignKey: 'laboratoryId' });
      Laboratories.addScope('active', {
        where: { inactivatedAt: null }
      });
    }

    static bulkInactivate(ids) {
      return Laboratories.update(
        { inactivatedAt: new Date() },
        { where: { id: { [Op.in]: ids } } }
      );
    }
  }

  Laboratories.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      }
    },
    address:  {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
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
    }
  }, {
    sequelize,
    modelName: 'Laboratories',
  });

  return Laboratories;
};