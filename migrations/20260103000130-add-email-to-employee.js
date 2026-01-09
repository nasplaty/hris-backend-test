'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('employees', 'email', {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true,  // Make sure the email is unique
      validate: {
        isEmail: true,  // Validate if the email format is correct
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('employees', 'email');
  }
};
