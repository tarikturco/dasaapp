'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('LabExams', {
      laboratoryId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      examId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('LabExams');
  }
};