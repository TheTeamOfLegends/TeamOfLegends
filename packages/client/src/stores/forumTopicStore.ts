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
}))
