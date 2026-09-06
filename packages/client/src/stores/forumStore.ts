import { create } from 'zustand'

import { getTopics } from '../api/forumApi'
import { Topic } from '../types/forum'

interface ForumState {
  topics: Topic[] | null
  isLoading: boolean
  loadForum: (force?: boolean) => Promise<void>
  resetForum: () => void
}

export const useForumStore = create<ForumState>((set, get) => ({
  topics: null,
  isLoading: false,

  resetForum() {
    set({ topics: null, isLoading: false })
  },

  async loadForum(force = false) {
    if (!force && get().topics) {
      return
    }

    set({ isLoading: true })

    try {
      const topics = await getTopics()
      set({ topics, isLoading: false })
    } catch (e) {
      set({ topics: [], isLoading: false })
      throw e
    }
  },
}))
