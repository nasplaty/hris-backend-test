// src/migrations/20260109064337-add-duration-months-to-packages.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Pastikan kolom belum ada sebelum menambahkannya
    const tableDescription = await queryInterface.describeTable('packages');
    if (!tableDescription.duration_months) {
      await queryInterface.addColumn('packages', 'duration_months', {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 1,
      });
    }
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('packages', 'duration_months');
  },
};
