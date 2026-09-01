'use strict'

const tableName = 'comments'
const authorColumnName = 'author'
const topicIdColumnName = 'topic_id'
const parentIdColumnName = 'parent_id'
const createdAtColumnName = 'created_at'

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
      topicId: {
        field: topicIdColumnName,
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'topics',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      author: {
        field: authorColumnName,
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      body: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      parentId: {
        field: parentIdColumnName,
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: tableName,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        field: createdAtColumnName,
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

    await queryInterface.addIndex(tableName, [authorColumnName], {
      name: `${tableName}_${authorColumnName}_idx`,
    })

    await queryInterface.addIndex(tableName, [topicIdColumnName], {
      name: `${tableName}_${topicIdColumnName}_idx`,
    })

    await queryInterface.addIndex(tableName, [parentIdColumnName], {
      name: `${tableName}_${parentIdColumnName}_idx`,
    })

    await queryInterface.addIndex(tableName, [createdAtColumnName], {
      name: `${tableName}_${createdAtColumnName}_idx`,
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex(
      tableName,
      `${tableName}_${createdAtColumnName}_idx`
    )

    await queryInterface.removeIndex(
      tableName,
      `${tableName}_${parentIdColumnName}_idx`
    )

    await queryInterface.removeIndex(
      tableName,
      `${tableName}_${topicIdColumnName}_idx`
    )

    await queryInterface.removeIndex(
      tableName,
      `${tableName}_${authorColumnName}_idx`
    )

    await queryInterface.dropTable(tableName)
  },
}
