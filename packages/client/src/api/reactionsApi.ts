import { API_BASE_URL } from '@/constants'
import { Reactions } from '@/types/reaction'

export const setCommentReaction = async (
  commentId: number,
  emoji: string
): Promise<Reactions> => {
  const response = await fetch(
    `${API_BASE_URL}/forum/comments/${commentId}/reactions`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emoji }),
    }
  )

  if (!response.ok) {
    throw new Error('Не удалось изменить реакцию')
  }

  return response.json()
}

export const removeCommentReaction = async (
  commentId: number
): Promise<Reactions> => {
  const response = await fetch(
    `${API_BASE_URL}/forum/comments/${commentId}/reactions`,
    {
      method: 'DELETE',
      credentials: 'include',
    }
  )

  if (!response.ok) {
    throw new Error('Не удалось удалить реакцию')
  }

  return response.json()
}

export const setTopicReaction = async (
  topicId: number,
  emoji: string
): Promise<Reactions> => {
  const response = await fetch(
    `${API_BASE_URL}/forum/topics/${topicId}/reactions`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emoji }),
    }
  )

  if (!response.ok) {
    throw new Error('Не удалось изменить реакцию')
  }

  return response.json()
}

export const removeTopicReaction = async (
  topicId: number
): Promise<Reactions> => {
  const response = await fetch(
    `${API_BASE_URL}/forum/topics/${topicId}/reactions`,
    {
      method: 'DELETE',
      credentials: 'include',
    }
  )

  if (!response.ok) {
    throw new Error('Не удалось удалить реакцию')
  }

  return response.json()
}
