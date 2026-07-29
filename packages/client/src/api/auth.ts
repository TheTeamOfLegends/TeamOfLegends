import { getProfile } from './profileApi'
import { useProfileStore } from '../stores/profileStore'

export const checkAuth = async (): Promise<boolean> => {
  try {
    const user = await getProfile()
    useProfileStore.getState().setUser(user)
    return true
  } catch {
    useProfileStore.getState().clearUser()
    return false
  }
}
