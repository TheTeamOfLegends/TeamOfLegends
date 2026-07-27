import { create } from 'zustand'

import { SERVER_HOST } from '../constants'

export type Friend = {
  name: string
  secondName: string
  avatar: string
}

interface FriendsState {
  data: Friend[]
  isLoading: boolean
  loadFriends: () => Promise<void>
}

export const useFriendsStore = create<FriendsState>((set, get) => ({
  data: [],
  isLoading: false,

  async loadFriends() {
    if (get().isLoading) {
      return
    }

    set({ data: [], isLoading: true })

    try {
      const response = await fetch(`${SERVER_HOST}/friends`)
      const data = (await response.json()) as Friend[]
      set({ data, isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },
}))
