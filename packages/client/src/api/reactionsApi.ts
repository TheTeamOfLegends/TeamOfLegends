import { SERVER_HOST } from '@/constants'
import { Reactions } from '@/types/reaction'

const getTopicReactions = async (topicId: number): Promise<Reactions> => {
  const response = await fetch(
    `${SERVER_HOST}/forum/topic/${topicId}/reactions`
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

export const setTopicReaction = async (
  topicId: number,
  emoji: string
): Promise<Reactions> => {
  const response = await fetch(
    `${SERVER_HOST}/forum/topic/${topicId}/reactions`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emoji,
      }),
    }
  )

  if (!response.ok) {
    throw new Error('Не удалось изменить реакцию')
  }

  return getTopicReactions(topicId)
}

export const removeTopicReaction = async (
  topicId: number
): Promise<Reactions> => {
  const response = await fetch(
    `${SERVER_HOST}/forum/topic/${topicId}/reactions`,
    {
      method: 'DELETE',
    }
  )

  if (!response.ok) {
    throw new Error('Не удалось удалить реакцию')
  }

  return getTopicReactions(topicId)
}
