'use strict'

const tableName = 'reactions'

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tableName, {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      emoji: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },

      userId: {
        field: 'user_id',
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      topicId: {
        field: 'topic_id',
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'topics',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      createdAt: {
        field: 'created_at',
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },

      updatedAt: {
        field: 'updated_at',
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    })

    await queryInterface.addIndex(tableName, ['user_id', 'topic_id'], {
      name: `${tableName}_user_id_topic_id_idx`,
      unique: true,
    })
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      tableName,
      `${tableName}_user_id_topic_id_idx`
    )

    await queryInterface.dropTable(tableName)
  },
}
