import { getProfile, NetworkError } from './profileApi'
import { useProfileStore } from '../stores/profileStore'
import {
  clearAuthSession,
  getAuthSession,
  saveAuthSession,
} from './authSession'

/**
 * Проверяет авторизацию через API.
 * При недоступности сети использует последний успешный профиль из localStorage,
 * чтобы AuthGuard не выкидывал пользователя в офлайне (PWA / service worker).
 */
export const checkAuth = async (): Promise<boolean> => {
  try {
    const user = await getProfile()
    useProfileStore.getState().setUser(user)
    saveAuthSession(user)
    return true
  } catch (error) {
    const offlineOrNetwork =
      error instanceof NetworkError ||
      (typeof navigator !== 'undefined' && navigator.onLine === false)

    if (offlineOrNetwork) {
      const cached = getAuthSession()
      if (cached) {
        useProfileStore.getState().setUser(cached)
        return true
      }
    }

    useProfileStore.getState().clearUser()
    clearAuthSession()
    return false
  }
}
