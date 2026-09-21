'use strict';

const DARK_THEME = 'dark'
const LIGHT_THEME = 'light'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('themes', [
      {
        theme: DARK_THEME,
      },
      {
        theme: LIGHT_THEME,
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('themes', {
      theme: [DARK_THEME, LIGHT_THEME]
    }, {});
  }
};
