import { create } from 'zustand'

import * as profileApi from '@/api/profileApi'
import { clearAuthSession, saveAuthSession } from '@/api/authSession'
import { User } from '../types/user'

interface ProfileState {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  clearUser: () => void
  loadProfile: () => Promise<User>
  updateAvatar: (file: File) => Promise<void>
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  user: null,
  isLoading: false,

  setUser(user) {
    if (user) {
      saveAuthSession(user)
    }
    set({ user, isLoading: false })
  },

  clearUser() {
    clearAuthSession()
    set({ user: null, isLoading: false })
  },

  async loadProfile() {
    const existing = get().user
    if (existing && !get().isLoading) {
      return existing
    }

    set({ isLoading: true })

    try {
      const user = await profileApi.getProfile()
      saveAuthSession(user)
      set({ user, isLoading: false })
      return user
    } catch (e) {
      if (e instanceof profileApi.NetworkError) {
        const cached = get().user
        if (cached) {
          set({ isLoading: false })
          return cached
        }
      }
      clearAuthSession()
      set({ user: null, isLoading: false })
      throw e
    }
  },

  async updateAvatar(file) {
    const user = await profileApi.updateAvatar(file)
    saveAuthSession(user)
    set({ user })
  },
}))
