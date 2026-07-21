import { getProfile } from './profileApi'

export const checkAuth = async (): Promise<boolean> => {
  try {
    await getProfile()
    return true
  } catch {
    return false
  }
}
