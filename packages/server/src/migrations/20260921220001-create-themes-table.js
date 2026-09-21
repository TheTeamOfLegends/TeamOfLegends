'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('themes', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      theme: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    })

    await queryInterface.addIndex('themes', ['theme'], {
      name: 'themes_theme_idx'
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('themes')
  }
}