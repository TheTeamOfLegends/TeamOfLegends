import { create } from 'zustand'

import * as profileApi from '@/api/profileApi'
import { User } from '../types/user'

interface ProfileState {
  user: User | null

  isLoading: boolean

  loadProfile: () => Promise<void>

  updateAvatar: (file: File) => Promise<void>
}

export const useProfileStore = create<ProfileState>(set => ({
  user: null,
  isLoading: false,

  async loadProfile() {
    set({ isLoading: true })

    try {
      const user = await profileApi.getProfile()

      set({
        user,
        isLoading: false,
      })
    } catch (e) {
      set({ isLoading: false })
      throw e
    }
  },

  async updateAvatar(file) {
    const user = await profileApi.updateAvatar(file)

    set({ user })
  },
}))
