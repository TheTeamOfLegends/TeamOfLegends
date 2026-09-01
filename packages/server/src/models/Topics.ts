import { sequelize } from '../../db'
import type { ForumRelatedId, ForumTopic } from '../types'
import { Model, DataTypes } from 'sequelize'
import { User } from './Users'
import {
  sanitizeString,
  sanitizeNumber,
  sanitizeBoolean,
} from '../utils/sanitizeData'

export class Topic extends Model<ForumTopic> implements ForumTopic {
  public id!: number
  public title!: string
  public body!: string
  public author!: ForumRelatedId
  public isSticky!: boolean

  public static async getWithCountAll(data: Record<string, unknown>) {
    const limit = sanitizeNumber(data.limit)
    const offset = sanitizeNumber(data.offset)
    return this.findAndCountAll({
      ...(limit && { limit }),
      ...(offset && { offset }),
      order: [
        ['isSticky', 'DESC'],
        ['createdAt', 'DESC'],
      ],
    })
  }

  public static async createNew(data: Record<string, unknown>) {
    const title = sanitizeString(data.title)
    const body = sanitizeString(data.body)
    const author = sanitizeNumber(data.author)
    const isSticky = sanitizeBoolean(data.isSticky)

    if (!title || !body || !author) {
      throw new Error(
        'Ошибка создания топика: не все обязательные поля заполнены: ' +
          JSON.stringify(data)
      )
    }

    await User.createIfNotExists(author)

    return Topic.create({
      title,
      body,
      author,
      isSticky,
    })
  }

  public static async destroyByPk(id: unknown) {
    const topicId = sanitizeNumber(id)

    if (topicId === null) {
      throw new Error('Id топика должно быть число')
    }

    return Topic.destroy({
      where: {
        id: topicId,
      },
    })
  }

  public static async updateOne(data: Record<string, unknown>) {
    const id = sanitizeNumber(data.id)
    const title = sanitizeString(data.title)
    const body = sanitizeString(data.body)
    const isSticky = sanitizeBoolean(data.isSticky)

    if (id === null) {
      throw new Error('Ошибка в переданных данных, отсутствует ID топика')
    }

    if (
      title === null &&
      body === null &&
      typeof data.isSticky === 'undefined'
    ) {
      throw new Error(
        'Ошибка в переданных данных, отсутствуют данные для обновления'
      )
    }

    const model = await Topic.findByPk(id)

    if (model === null) {
      throw new Error('Топик не найден')
    }

    if (body !== null) {
      model.body = body
    }

    if (title !== null) {
      model.title = title
    }

    if (typeof data.isSticky !== 'undefined') {
      model.isSticky = isSticky
    }

    return model.save()
  }
}

Topic.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    author: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isSticky: {
      field: 'is_sticky',
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'topics',
    underscored: true,
  }
)
