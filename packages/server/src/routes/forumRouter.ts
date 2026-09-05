import express from 'express'

import { Topic, Comment } from '../models'
import {
  setTopicReaction,
  removeTopicReaction,
  getReactions,
} from '../controllers/reactionsController'

const forumRouter = express.Router()

/**
 * Получить топики и общее количество топиков
 *
 * Параметры get запроса:
 * limit: number Ограничить выборку количеством => optional
 * offset: number Смещение по выборке => optional
 *
 * Возвращаемое значение: объект с ключами rows, count
 */
forumRouter.get('/topics', async (req, res) => {
  const response = await Topic.getWithCountAll({
    limit: req.query.limit,
    offset: req.query.offset,
  })

  res.json(response)
})

/**
 * Создание нового топика
 */
forumRouter.post('/topic/create', async (req, res) => {
  try {
    const newTopic = await Topic.createNew({
      title: req.body.title,
      body: req.body.body,
      author: req.user.id,
      isSticky: req.body.isSticky,
    })

    res.status(201).json({ newTopic })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      error: 'Не удалось создать новый топик форума',
    })
  }
})

/**
 * Получить топик по id
 */
forumRouter.get('/topic/:id', async (req, res) => {
  try {
    const id = req.params.id

    const topic = await Topic.findByPk(id)

    if (topic === null) {
      res.status(404).json('Топик не найден')
      return
    }

    res.json({
      topic,
    })
  } catch (error) {
    console.log(error)
    res.status(404).json('Топик не найден')
  }
})

/**
 * Удалить топик по id
 */
forumRouter.delete('/topic/:id', async (req, res) => {
  try {
    const id = req.params.id

    await Topic.destroyByPk(id)

    res.status(200).json('Топик удален')
  } catch (error) {
    console.log(error)
    res.status(404).json('Топик не найден')
  }
})

/**
 * Обновить топик по id
 */
forumRouter.put('/topic', async (req, res) => {
  try {
    const topic = await Topic.updateOne({
      id: req.body.id,
      title: req.body.title,
      body: req.body.body,
      isSticky: req.body.isSticky,
    })

    res.status(200).json({ topic })
  } catch (error) {
    console.log(error)
    res.status(404).json('Ошибка при обновлении топика')
  }
})

/**
 * Создание нового комментария
 */
forumRouter.post('/comment/create', async (req, res) => {
  try {
    const newComment = await Comment.createNew({
      topicId: req.body.topicId,
      author: req.user.id,
      body: req.body.body,
      parentId: req.body.parentId,
    })

    res.status(201).json({ newComment })
  } catch (error) {
    console.log(error)
    res.status(400).json('Не удалось создать комментарий')
  }
})

/**
 * Удалить комментарий по id
 */
forumRouter.delete('/comment/:id', async (req, res) => {
  try {
    const id = req.params.id

    await Comment.destroyByPk(id)

    res.status(200).json('Комментарий удален')
  } catch (error) {
    console.log(error)
    res.status(404).json('Комментарий не найден')
  }
})

/**
 * Обновить комментарий по id
 */
forumRouter.put('/comment', async (req, res) => {
  try {
    const comment = await Comment.updateOne({
      id: req.body.id,
      body: req.body.body,
    })

    res.status(200).json({ comment })
  } catch (error) {
    console.log(error)
    res.status(404).json('Ошибка при обновлении комментария')
  }
})

/**
 * Получить комментарии для топика
 *
 * Параметры:
 * 1. view: one of [plain, tree] Тип выборки: простая или древовидная => optional, default: tree
 * 2. limit: number Ограничить выборку количеством => optional
 * 3. offset: number Смещение по выборке => optional
 *
 * Возвращаемое значение: объект с ключами rows, count
 */
forumRouter.get('/topic/:id/comments', async (req, res) => {
  try {
    const id = req.params.id

    const comments = await Comment.findByTopicId({
      topicId: id,
      limit: req.query.limit,
      offset: req.query.offset,
      view: req.query.view,
    })

    res.json({
      comments,
    })
  } catch (error) {
    console.log(error)
    res.status(404).json('Топик не найден')
  }
})

/**
 * Установить реакцию на топик
 */
forumRouter.post('/topic/:id/reactions', setTopicReaction)

/**
 * Удалить реакцию с топика
 */
forumRouter.delete('/topic/:id/reactions', removeTopicReaction)

/**
 * Получить реакции топика
 */
forumRouter.get('/topic/:id/reactions', getReactions)

export default forumRouter
