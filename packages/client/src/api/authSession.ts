import type { User } from '../types/user'

const AUTH_SESSION_KEY = 'space-assault-auth-user'

export const saveAuthSession = (user: User): void => {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(user))
  } catch {
    // ignore quota / private mode errors
  }
}

export const getAuthSession = (): User | null => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const raw = localStorage.getItem(AUTH_SESSION_KEY)
    if (!raw) {
      return null
    }

    const user = JSON.parse(raw) as User
    if (!user || typeof user.id !== 'number' || !user.login) {
      return null
    }

    return user
  } catch {
    return null
  }
}

export const clearAuthSession = (): void => {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.removeItem(AUTH_SESSION_KEY)
  } catch {
    // ignore
  }
}
