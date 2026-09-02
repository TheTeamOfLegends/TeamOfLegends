'use strict'

const tableName = 'topics'
const authorColumnName = 'author'
const createdAtColumnName = 'created_at'
const stickyColumnName = 'is_sticky'

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
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      body: {
        type: Sequelize.TEXT,
        allowNull: false,
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
      isSticky: {
        field: stickyColumnName,
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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

    await queryInterface.addIndex(tableName, [createdAtColumnName], {
      name: `${tableName}_${createdAtColumnName}_idx`,
    })

    await queryInterface.addIndex(tableName, [stickyColumnName], {
      name: `${tableName}_${stickyColumnName}_idx`,
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex(
      tableName,
      `${tableName}_${stickyColumnName}_idx`
    )

    await queryInterface.removeIndex(
      tableName,
      `${tableName}_${createdAtColumnName}_idx`
    )

    await queryInterface.removeIndex(
      tableName,
      `${tableName}_${authorColumnName}_idx`
    )

    await queryInterface.dropTable(tableName)
  },
}
