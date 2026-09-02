import type { Request, Response } from 'express'

import { Reaction } from '../models/'

export const setReaction = async (req: Request, res: Response) => {
  try {
    const reaction = await Reaction.setReaction({
      emoji: req.body.emoji,
      userId: req.body.userId,
      topicId: req.body.topicId,
      commentId: req.body.commentId,
    })

    res.status(201).json({ reaction })
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'Не удалось установить реакцию' })
  }
}

export const removeReaction = async (req: Request, res: Response) => {
  try {
    await Reaction.removeReaction({
      userId: req.body.userId,
      topicId: req.body.topicId,
      commentId: req.body.commentId,
    })

    res.status(200).json({ success: true })
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'Не удалось удалить реакцию' })
  }
}

export const getReactions = async (req: Request, res: Response) => {
  try {
    const reactions = await Reaction.getReactions({
      topicId: req.query.topicId ? Number(req.query.topicId) : undefined,
      commentId: req.query.commentId ? Number(req.query.commentId) : undefined,
    })

    res.json({ reactions })
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'Не удалось получить реакции' })
  }
}
