import {
  removeTopicReaction as removeTopicReactionApi,
  setTopicReaction as setTopicReactionApi,
} from '@/api/reactionsApi'
import { create } from 'zustand'

import { getComments, getTopic } from '../api/forumApi'
import { SERVER_HOST } from '../constants'
import { ForumComment, Topic } from '../types/forum'

interface ForumTopicState {
  topic: Topic | null
  comments: ForumComment[]
  isLoading: boolean
  loadTopic: (id: number, force?: boolean) => Promise<void>
  seedTopic: (topic: Topic) => void
  appendComment: (comment: ForumComment) => void
  resetTopic: () => void
  setTopicReaction: (topicId: number, emoji: string) => Promise<void>
  removeTopicReaction: (topicId: number) => Promise<void>
}

export const useForumTopicStore = create<ForumTopicState>((set, get) => ({
  topic: null,
  comments: [],
  isLoading: true,

  resetTopic() {
    set({ topic: null, comments: [], isLoading: true })
  },

  seedTopic(topic) {
    set({ topic, comments: [], isLoading: false })
  },

  appendComment(comment) {
    set({ comments: [...get().comments, comment] })
  },

  async loadTopic(id, force = false) {
    const current = get().topic
    if (!force && current && current.id === id) {
      return
    }

    set({
      topic: null,
      comments: [],
      isLoading: true,
    })

    try {
      const [topic, comments] = await Promise.all([
        getTopic(id),
        getComments(id),
      ])

      let reactions: Topic['reactions'] = []

      try {
        const reactionsResponse = await fetch(
          `${SERVER_HOST}/forum/topic/${id}/reactions`
        )

        if (reactionsResponse.ok) {
          const reactionsData = (await reactionsResponse.json()) as {
            reactions: Topic['reactions']
          }
          reactions = reactionsData.reactions
        }
      } catch {
        reactions = []
      }

      set({
        topic: { ...topic, reactions },
        comments,
        isLoading: false,
      })
    } catch {
      set({ topic: null, comments: [], isLoading: false })
    }
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
