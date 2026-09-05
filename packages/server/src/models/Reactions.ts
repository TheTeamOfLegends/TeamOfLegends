import { DataTypes, Model } from 'sequelize'

import { sequelize } from '../../db'
import type { ForumReaction } from '../types'
import { sanitizeString, sanitizeNumber } from '../utils/sanitizeData'

export class Reaction extends Model<ForumReaction> implements ForumReaction {
  id!: number
  emoji!: string
  userId!: number
  topicId!: number

  public static async setReaction(
    data: Record<string, unknown>
  ): Promise<Reaction> {
    const emoji = sanitizeString(data.emoji)
    const userId = sanitizeNumber(data.userId)
    const topicId = sanitizeNumber(data.topicId)

    if (emoji === null || userId === null || topicId === null) {
      throw new Error('Ошибка в переданных данных')
    }

    const existingReaction = await Reaction.findOne({
      where: {
        userId,
        topicId,
      },
    })

    if (existingReaction) {
      existingReaction.emoji = emoji
      return existingReaction.save()
    }

    return Reaction.create({
      emoji,
      userId,
      topicId,
    })
  }

  public static async removeReaction(
    data: Record<string, unknown>
  ): Promise<void> {
    const userId = sanitizeNumber(data.userId)
    const topicId = sanitizeNumber(data.topicId)

    if (userId === null || topicId === null) {
      throw new Error('Ошибка в переданных данных')
    }

    await Reaction.destroy({
      where: {
        userId,
        topicId,
      },
    })
  }

  public static async getReactions(
    data: Record<string, unknown>
  ): Promise<Reaction[]> {
    const topicId = sanitizeNumber(data.topicId)

    if (topicId === null) {
      throw new Error('Ошибка в переданных данных')
    }

    return Reaction.findAll({
      where: {
        topicId,
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
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'reactions',
    underscored: true,
  }
)
