'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Laboratories extends Model {

    static associate(models) {

    }
  }

  Laboratories.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    status: DataTypes.ENUM(['ACTIVE', 'INACTIVE'])
  }, {
    sequelize,
    modelName: 'Laboratories',
  });

  return Laboratories;
};