import { create } from 'zustand'

import { getComments, getTopic } from '../api/forumApi'
import { ForumComment, Topic } from '../types/forum'

interface ForumTopicState {
  topic: Topic | null
  comments: ForumComment[]
  isLoading: boolean
  loadTopic: (id: number, force?: boolean) => Promise<void>
  resetTopic: () => void
}

export const useForumTopicStore = create<ForumTopicState>((set, get) => ({
  topic: null,
  comments: [],
  isLoading: true,

  resetTopic() {
    set({ topic: null, comments: [], isLoading: true })
  },

  async loadTopic(id, force = false) {
    const current = get().topic
    if (!force && current && current.id === id) {
      return
    }

    set({ topic: null, comments: [], isLoading: true })

    try {
      const [topic, comments] = await Promise.all([
        getTopic(id),
        getComments(id),
      ])
      set({ topic, comments, isLoading: false })
    } catch (e) {
      set({ topic: null, comments: [], isLoading: false })
      throw e
    }
  },
}))
