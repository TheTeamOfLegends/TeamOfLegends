import { create } from 'zustand'

import { SERVER_HOST } from '../constants'
import { topicsMock } from '../pages/ForumPage/topicsMock'
import { Topic } from '../types/forum'

interface ForumState {
  topics: Topic[] | null
  isLoading: boolean
  loadForum: () => Promise<void>
}

export const useForumStore = create<ForumState>((set, get) => ({
  topics: null,
  isLoading: false,

  async loadForum() {
    if (get().topics) {
      return
    }

    set({ topics: [], isLoading: true })

    try {
      const response = await fetch(`${SERVER_HOST}/api/forum`)
      if (!response.ok) {
        throw new Error('Forum request failed')
      }
      const topics = (await response.json()) as Topic[]
      set({ topics, isLoading: false })
    } catch {
      // TODO удалить mock данные после интеграции с API
      set({ topics: topicsMock, isLoading: false })
    }
  },
}))
