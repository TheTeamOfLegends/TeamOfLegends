'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const path = require('path')
    const mocksPath = path.resolve(__dirname, '..', 'mocks', 'topicsMocks')

    const { forumUsers, forumTopics, forumComments } =
      require(mocksPath).default

    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.bulkInsert('users', forumUsers, { transaction })
      await queryInterface.bulkInsert('topics', forumTopics, { transaction })
      await queryInterface.bulkInsert('comments', forumComments, {
        transaction,
      })
      await queryInterface.sequelize.query(
        `SELECT setval(pg_get_serial_sequence('topics', 'id'), COALESCE(max(id), 0) + 1, false) FROM topics;`,
        { transaction }
      )
      await queryInterface.sequelize.query(
        `SELECT setval(pg_get_serial_sequence('comments', 'id'), COALESCE(max(id), 0) + 1, false) FROM comments;`,
        { transaction }
      )
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.bulkDelete('comments', null, { transaction })
      await queryInterface.bulkDelete('topics', null, { transaction })
      await queryInterface.bulkDelete('users', null, { transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },
}
