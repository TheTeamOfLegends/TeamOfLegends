import { DataTypes, Model, QueryTypes } from 'sequelize'
import type { ForumComment, ForumRelatedId } from '../types'
import { sequelize } from '../../db'
import { sanitizeString, sanitizeNumber } from '../utils/sanitizeData'
import { mapRawToModel } from '../utils/db'
import { User } from './Users'

export class Comment extends Model<ForumComment> implements ForumComment {
  id!: number
  topicId!: number
  body!: string
  author!: ForumRelatedId
  parentId!: ForumRelatedId

  public static async createNew(data: Record<string, unknown>) {
    const topicId = sanitizeNumber(data.topicId)
    const author = sanitizeNumber(data.author)
    const parentId = sanitizeNumber(data.parentId)
    const body = sanitizeString(data.body)

    if (!topicId || !author || !body) {
      throw new Error(
        'Ошибка создания топика: не все требуемые поля заполнены: ' +
          JSON.stringify(data)
      )
    }

    await User.createIfNotExists(author)

    return Comment.create({
      topicId,
      author,
      body,
      parentId,
    })
  }

  public static async findByTopicId(data: Record<string, unknown>) {
    const topicId = sanitizeNumber(data.topicId)

    if (topicId === null) {
      throw new Error('Ошибка в переданных данных')
    }

    const limit = sanitizeNumber(data.limit)
    const offset = sanitizeNumber(data.offset)
    const view = sanitizeString(data.view)

    if (view === 'plain') {
      return await Comment.findAndCountAll({
        ...(limit && { limit }),
        ...(offset && { offset }),
        where: {
          topicId: topicId,
        },
        order: [['id', 'ASC']],
      })
    }

    const count = await Comment.count({
      where: {
        parentId: null,
      },
    })

    const rawRows = (await sequelize.query(
      `
      WITH RECURSIVE
        root_tree AS (
          SELECT *
          FROM comments
          WHERE parent_id is null
          ORDER BY id asc
          OFFSET $1
          LIMIT $2
        ),
        comments_tree AS (
          SELECT *
          FROM root_tree
          UNION ALL
          SELECT c.*
          FROM comments c
          JOIN comments_tree ct ON ct.id = c.parent_id
        )
      SELECT * FROM comments_tree ORDER BY id asc`,
      { bind: [offset, limit], type: QueryTypes.SELECT }
    )) as Record<string, unknown>[]

    const rows = mapRawToModel<ForumComment>(rawRows, Comment)

    const commentsTree: ForumComment[] = []
    const rowsContainer: Map<number, ForumComment> = new Map()

    rows.forEach(c => {
      c.replies = []

      if (c.parentId === null) {
        commentsTree.push(c)
      }

      rowsContainer.set(c.id!, c)
    })

    rowsContainer.forEach(c => {
      if (c.parentId) {
        rowsContainer.get(c.parentId)?.replies?.push(c)
      }
    })

    return { count, rows: commentsTree }
  }

  public static async destroyByPk(id: unknown) {
    const commentId = sanitizeNumber(id)

    if (commentId === null) {
      throw new Error('Id комментария должно быть число')
    }

    return Comment.destroy({
      where: {
        id: commentId,
      },
    })
  }

  public static async updateOne(data: Record<string, unknown>) {
    const id = sanitizeNumber(data.id)
    const body = sanitizeString(data.body)

    if (id === null) {
      throw new Error('Ошибка в переданных данных, отсутствует ID комментария')
    }

    if (body === null) {
      throw new Error(
        'Ошибка в переданных данных, отсутствует тело комментария'
      )
    }

    const model = await Comment.findByPk(id)

    if (model === null) {
      throw new Error('Комментарий не найден')
    }

    model.body = body
    return model.save()
  }
}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    topicId: {
      field: 'topic_id',
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    author: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    parentId: {
      field: 'parent_id',
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'comments',
    underscored: true,
  }
)
