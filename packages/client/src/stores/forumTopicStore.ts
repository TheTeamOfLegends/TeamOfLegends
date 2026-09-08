import {
  removeTopicReaction as removeTopicReactionApi,
  setTopicReaction as setTopicReactionApi,
} from '@/api/reactionsApi'
import { create } from 'zustand'
import { SERVER_HOST } from '../constants'
import { findTopic } from '../pages/ForumPage/topicsMock'
import { commentsMock } from '../pages/ForumTopicPage/commentsMock'
import { ForumComment, Topic } from '../types/forum'

interface ForumTopicState {
  topic: Topic | null
  comments: ForumComment[]
  isLoading: boolean
  loadTopic: (id: number) => Promise<void>
  setTopicReaction: (topicId: number, emoji: string) => Promise<void>
  removeTopicReaction: (topicId: number) => Promise<void>
}

export const useForumTopicStore = create<ForumTopicState>((set, get) => ({
  topic: null,
  comments: [],
  isLoading: true,

  async loadTopic(id) {
    const current = get().topic

    if (current && current.id === id) {
      return
    }

    set({
      topic: null,
      comments: [],
      isLoading: true,
    })

    const [topicResponse, commentsResponse] = await Promise.all([
      fetch(`${SERVER_HOST}/forum/topic/${id}`),
      fetch(`${SERVER_HOST}/forum/topic/${id}/comments`),
    ])

    if (!topicResponse.ok || !commentsResponse.ok) {
      throw new Error('Forum topic request failed')
    }

    const topicData = (await topicResponse.json()) as {
      topic: Topic
    }

    const commentsData = (await commentsResponse.json()) as {
      comments: {
        count: number
        rows: ForumComment[]
      }
    }

    let reactions: Topic['reactions'] = []

    try {
      const reactionsResponse = await fetch(
        `${SERVER_HOST}/forum/topic/${id}/reactions`
      )

      if (!reactionsResponse.ok) {
        throw new Error('Failed to load reactions')
      }

      const reactionsData = (await reactionsResponse.json()) as {
        reactions: Topic['reactions']
      }

      reactions = reactionsData.reactions
    } catch {
      reactions = []
    }

    const topic: Topic = {
      ...topicData.topic,
      reactions,
    }

    set({
      topic,
      comments: commentsData.comments.rows,
      isLoading: false,
    })
  },

  async setTopicReaction(topicId, emoji) {
    const currentReaction = get().topic?.reactions.find(
      reaction => reaction.reactedByMe
    )

    if (currentReaction?.emoji === emoji) {
      await get().removeTopicReaction(topicId)
      return
    }

    const data = await setTopicReactionApi(topicId, emoji)

    set(state => ({
      topic:
        state.topic && state.topic.id === topicId
          ? {
              ...state.topic,
              reactions: data.reactions.map(reaction => ({
                ...reaction,
                reactedByMe: reaction.emoji === emoji,
              })),
            }
          : state.topic,
    }))
  },

  async removeTopicReaction(topicId) {
    const data = await removeTopicReactionApi(topicId)

    set(state => ({
      topic:
        state.topic && state.topic.id === topicId
          ? {
              ...state.topic,
              reactions: data.reactions,
            }
          : state.topic,
    }))
  },
}))
