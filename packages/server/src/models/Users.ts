import { sequelize } from '../../db'
import type { ForumUser } from '../types'
import { Model, DataTypes } from 'sequelize'

export class User extends Model<ForumUser> implements ForumUser {
  public id!: number

  public static async createIfNotExists(id: number) {
    return this.findOrCreate({
      where: {
        id,
      },
      defaults: {
        id,
      },
    })
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: false,
  }
)
