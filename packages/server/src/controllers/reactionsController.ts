import type { Request, Response } from 'express'

import { Reaction } from '../models'
import { sanitizeNumber } from '../utils/sanitizeData'

export const setTopicReaction = async (req: Request, res: Response) => {
  try {
    const topicId = sanitizeNumber(req.params.id)
    const userId = req.user.id

    if (topicId === null) {
      res.status(400).json({ error: 'Некорректный ID топика' })
      return
    }

    const reaction = await Reaction.setReaction({
      emoji: req.body.emoji,
      userId,
      topicId,
    })

    res.status(201).json({ reaction })
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'Не удалось установить реакцию' })
  }
}

export const removeTopicReaction = async (req: Request, res: Response) => {
  try {
    const topicId = sanitizeNumber(req.params.id)
    const userId = req.user.id

    if (topicId === null) {
      res.status(400).json({ error: 'Некорректный ID топика' })
      return
    }

    await Reaction.removeReaction({
      userId,
      topicId,
    })

    res.status(200).json({ success: true })
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'Не удалось удалить реакцию' })
  }
}

export const getReactions = async (req: Request, res: Response) => {
  try {
    const topicId = sanitizeNumber(req.params.id)

    if (topicId === null) {
      res.status(400).json({ error: 'Некорректный ID топика' })
      return
    }

    const reactions = await Reaction.getReactionSummary({
      topicId,
    })

    res.json({ reactions })
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'Не удалось получить реакции' })
  }
}
