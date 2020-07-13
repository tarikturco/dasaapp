'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Laboratories extends Model {

    static associate(models) {
      Laboratories.belongsToMany(models.Exams, { through: 'LabExams', foreignKey: 'laboratoryId' });
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
    status:  {
      type: DataTypes.ENUM(['ACTIVE', 'INACTIVE'])
    },
  }, {
    sequelize,
    modelName: 'Laboratories',
  });

  return Laboratories;
};