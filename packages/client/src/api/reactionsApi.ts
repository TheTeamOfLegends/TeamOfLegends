import { SERVER_HOST } from '@/constants'
import { Reactions } from '@/types/reaction'

const getReactions = async (
  target: { topicId: number } | { commentId: number }
): Promise<Reactions> => {
  const params = new URLSearchParams()

  if ('topicId' in target) {
    params.set('topicId', String(target.topicId))
  } else {
    params.set('commentId', String(target.commentId))
  }

  const response = await fetch(
    `${SERVER_HOST}/forum/reactions?${params.toString()}`
  )

  if (!response.ok) {
    throw new Error('Не удалось получить реакции')
  }

  const data = (await response.json()) as {
    reactions: {
      emoji: string
      count: number
    }[]
  }

  return {
    reactions: data.reactions.map(reaction => ({
      emoji: reaction.emoji,
      count: reaction.count,
      reactedByMe: false,
    })),
  }
}

export const setCommentReaction = async (
  commentId: number,
  emoji: string,
  userId: number
): Promise<Reactions> => {
  const response = await fetch(`${SERVER_HOST}/forum/reaction`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      emoji,
      userId,
      commentId,
    }),
  })

  if (!response.ok) {
    throw new Error('Не удалось изменить реакцию')
  }

  return getReactions({ commentId })
}

export const removeCommentReaction = async (
  commentId: number,
  userId: number
): Promise<Reactions> => {
  const response = await fetch(`${SERVER_HOST}/forum/reaction`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      commentId,
    }),
  })

  if (!response.ok) {
    throw new Error('Не удалось удалить реакцию')
  }

  return getReactions({ commentId })
}

export const setTopicReaction = async (
  topicId: number,
  emoji: string,
  userId: number
): Promise<Reactions> => {
  const response = await fetch(`${SERVER_HOST}/forum/reaction`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      emoji,
      userId,
      topicId,
    }),
  })

  if (!response.ok) {
    throw new Error('Не удалось изменить реакцию')
  }

  return getReactions({ topicId })
}

export const removeTopicReaction = async (
  topicId: number,
  userId: number
): Promise<Reactions> => {
  const response = await fetch(`${SERVER_HOST}/forum/reaction`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      topicId,
    }),
  })

  if (!response.ok) {
    throw new Error('Не удалось удалить реакцию')
  }

  return getReactions({ topicId })
}
