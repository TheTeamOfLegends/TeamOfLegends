import { API_BASE_URL } from '@/constants'
import { ERROR_MESSAGES } from '@/dictionary'
import { clearAuthSession } from './authSession'

/** Сеть недоступна или service worker вернул 503 — не путать с «не авторизован». */
export class NetworkError extends Error {
  constructor(message = 'Network unavailable') {
    super(message)
    this.name = 'NetworkError'
  }
}

export const getProfile = async () => {
  let response: Response

  try {
    response = await fetch(`${API_BASE_URL}/v2/auth/user`, {
      credentials: 'include',
    })
  } catch {
    throw new NetworkError()
  }

  if (response.status === 503) {
    throw new NetworkError()
  }

  if (!response.ok) {
    let reason = ERROR_MESSAGES.REQUEST_FAILED
    try {
      const body = await response.json()
      reason = body.reason ?? reason
    } catch {
      // ignore non-JSON body
    }
    throw new Error(reason)
  }

  const user = await response.json()

  return user
}

export const updatePassword = async (
  oldPassword: string,
  newPassword: string
) => {
  const response = await fetch(`${API_BASE_URL}/v2/user/password`, {
    credentials: 'include',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      oldPassword,
      newPassword,
    }),
  })

  if (!response.ok) {
    const responseBody = await response.json()

    throw new Error(
      responseBody.reason ?? ERROR_MESSAGES.PASSWORD_CHANGE_FAILED
    )
  }
}

export const updateAvatar = async (avatar: File) => {
  const formData = new FormData()

  formData.append('avatar', avatar)

  const response = await fetch(`${API_BASE_URL}/v2/user/profile/avatar`, {
    credentials: 'include',
    method: 'PUT',
    body: formData,
  })

  if (!response.ok) {
    const responseBody = await response.json()

    throw new Error(responseBody.reason ?? ERROR_MESSAGES.AVATAR_CHANGE_FAILED)
  }

  return response.json()
}

export const logout = async () => {
  clearAuthSession()

  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' })
  }

  let response: Response

  try {
    response = await fetch(`${API_BASE_URL}/v2/auth/logout`, {
      credentials: 'include',
      method: 'POST',
    })
  } catch {
    // Офлайн-выход: локальная сессия уже очищена
    return
  }

  if (!response.ok) {
    const responseBody = await response.json().catch(() => null)

    throw new Error(responseBody?.reason ?? ERROR_MESSAGES.REQUEST_FAILED)
  }
}
