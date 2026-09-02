import { DataTypes, Model } from 'sequelize'

import { sequelize } from '../../db'

import type { ForumReaction } from '../types'

export class Reaction extends Model<ForumReaction> implements ForumReaction {
  id!: number
  emoji!: string
  userId!: number
  topicId!: number | null
  commentId!: number | null

  public static async setReaction(
    data: Record<string, unknown>
  ): Promise<Reaction> {
    const emoji = data.emoji
    const userId = data.userId
    const topicId = data.topicId
    const commentId = data.commentId

    if (
      typeof emoji !== 'string' ||
      typeof userId !== 'number' ||
      (typeof topicId !== 'number' &&
        topicId !== null &&
        typeof topicId !== 'undefined') ||
      (typeof commentId !== 'number' &&
        commentId !== null &&
        typeof commentId !== 'undefined')
    ) {
      throw new Error('Ошибка в переданных данных')
    }

    if (
      (typeof topicId === 'undefined' || topicId === null) &&
      (typeof commentId === 'undefined' || commentId === null)
    ) {
      throw new Error('Не указан топик или комментарий')
    }

    if (typeof topicId === 'number' && typeof commentId === 'number') {
      throw new Error(
        'Реакция не может одновременно относиться к топику и комментарию'
      )
    }

    const where =
      typeof topicId === 'number' ? { userId, topicId } : { userId, commentId }

    const existingReaction = await Reaction.findOne({ where })

    if (existingReaction) {
      existingReaction.emoji = emoji
      return existingReaction.save()
    }

    return Reaction.create({
      emoji,
      userId,
      topicId: typeof topicId === 'number' ? topicId : null,
      commentId: typeof commentId === 'number' ? commentId : null,
    })
  }

  public static async removeReaction(
    data: Record<string, unknown>
  ): Promise<void> {
    const userId = data.userId
    const topicId = data.topicId
    const commentId = data.commentId

    if (
      typeof userId !== 'number' ||
      (typeof topicId !== 'number' &&
        topicId !== null &&
        typeof topicId !== 'undefined') ||
      (typeof commentId !== 'number' &&
        commentId !== null &&
        typeof commentId !== 'undefined')
    ) {
      throw new Error('Ошибка в переданных данных')
    }

    if (
      (typeof topicId === 'undefined' || topicId === null) &&
      (typeof commentId === 'undefined' || commentId === null)
    ) {
      throw new Error('Не указан топик или комментарий')
    }

    if (typeof topicId === 'number' && typeof commentId === 'number') {
      throw new Error(
        'Реакция не может одновременно относиться к топику и комментарию'
      )
    }

    const where =
      typeof topicId === 'number' ? { userId, topicId } : { userId, commentId }

    await Reaction.destroy({ where })
  }

  public static async getReactions(
    data: Record<string, unknown>
  ): Promise<Reaction[]> {
    const topicId = data.topicId
    const commentId = data.commentId

    if (
      (typeof topicId !== 'number' &&
        topicId !== null &&
        typeof topicId !== 'undefined') ||
      (typeof commentId !== 'number' &&
        commentId !== null &&
        typeof commentId !== 'undefined')
    ) {
      throw new Error('Ошибка в переданных данных')
    }

    if (
      (typeof topicId === 'undefined' || topicId === null) &&
      (typeof commentId === 'undefined' || commentId === null)
    ) {
      throw new Error('Не указан топик или комментарий')
    }

    if (typeof topicId === 'number' && typeof commentId === 'number') {
      throw new Error(
        'Реакции не могут одновременно запрашиваться для топика и комментария'
      )
    }

    const where = typeof topicId === 'number' ? { topicId } : { commentId }

    return Reaction.findAll({
      where,
      order: [['createdAt', 'ASC']],
    })
  }

  public static async getReactionsByCommentIds(
    commentIds: number[]
  ): Promise<Reaction[]> {
    if (commentIds.length === 0) {
      return []
    }

    return Reaction.findAll({
      where: {
        commentId: commentIds,
      },
      order: [['createdAt', 'ASC']],
    })
  }

  public static async getReactionSummary(
    data: Record<string, unknown>
  ): Promise<
    {
      emoji: string
      count: number
    }[]
  > {
    const reactions = await Reaction.getReactions(data)

    const summary = new Map<string, number>()

    reactions.forEach(reaction => {
      summary.set(reaction.emoji, (summary.get(reaction.emoji) ?? 0) + 1)
    })

    return Array.from(summary.entries()).map(([emoji, count]) => ({
      emoji,
      count,
    }))
  }

  public static async getCommentReactionSummary(commentIds: number[]): Promise<
    {
      commentId: number
      reactions: {
        emoji: string
        count: number
      }[]
    }[]
  > {
    const reactions = await Reaction.getReactionsByCommentIds(commentIds)

    const grouped = new Map<number, Map<string, number>>()

    reactions.forEach(reaction => {
      if (reaction.commentId === null) {
        return
      }

      if (!grouped.has(reaction.commentId)) {
        grouped.set(reaction.commentId, new Map<string, number>())
      }

      const commentReactions = grouped.get(reaction.commentId)!

      commentReactions.set(
        reaction.emoji,
        (commentReactions.get(reaction.emoji) ?? 0) + 1
      )
    })

    return Array.from(grouped.entries()).map(
      ([commentId, commentReactions]) => ({
        commentId,
        reactions: Array.from(commentReactions.entries()).map(
          ([emoji, count]) => ({
            emoji,
            count,
          })
        ),
      })
    )
  }
}

Reaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    emoji: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },

    userId: {
      field: 'user_id',
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    topicId: {
      field: 'topic_id',
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    commentId: {
      field: 'comment_id',
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },

  {
    sequelize,
    tableName: 'reactions',
    underscored: true,
  }
)
