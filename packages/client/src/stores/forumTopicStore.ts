import {
  removeCommentReaction as removeCommentReactionApi,
  removeTopicReaction as removeTopicReactionApi,
  setCommentReaction as setCommentReactionApi,
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
  setCommentReaction: (commentId: number, emoji: string) => Promise<void>
  removeCommentReaction: (commentId: number) => Promise<void>
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

    set({ topic: null, comments: [], isLoading: true })

    try {
      const [topicResponse, commentsResponse] = await Promise.all([
        fetch(`${SERVER_HOST}/topic/${id}`),
        fetch(`${SERVER_HOST}/topic/${id}/comments`),
      ])

      if (!topicResponse.ok || !commentsResponse.ok) {
        throw new Error('Forum topic request failed')
      }

      const topic = (await topicResponse.json()) as Topic
      const comments = (await commentsResponse.json()) as ForumComment[]

      set({ topic, comments, isLoading: false })
    } catch {
      // TODO удалить mock данные после интеграции с API
      set({
        topic: findTopic(id),
        comments: commentsMock(id),
        isLoading: false,
      })
    }
  },

  async setTopicReaction(topicId, emoji) {
    const data = await setTopicReactionApi(topicId, emoji)

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

  async setCommentReaction(commentId, emoji) {
    const data = await setCommentReactionApi(commentId, emoji)

    set(state => ({
      comments: state.comments.map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              reactions: data.reactions,
            }
          : comment
      ),
    }))
  },

  async removeCommentReaction(commentId) {
    const data = await removeCommentReactionApi(commentId)

    set(state => ({
      comments: state.comments.map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              reactions: data.reactions,
            }
          : comment
      ),
    }))
  },
}))
