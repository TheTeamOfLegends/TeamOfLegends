import { API_BASE_URL } from '../constants'

export const checkAuth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/v2/auth/user`, {
      credentials: 'include',
    })

    return response.ok
  } catch {
    return false
  }
}
