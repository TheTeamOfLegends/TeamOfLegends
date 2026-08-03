import { API_BASE_URL } from '@/constants'
import { ERROR_MESSAGES } from '@/dictionary'

export const getProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/v2/auth/user`, {
    credentials: 'include',
  })

  if (!response.ok) {
    const body = await response.json()
    throw new Error(body.reason)
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
  const response = await fetch(`${API_BASE_URL}/v2/auth/logout`, {
    credentials: 'include',
    method: 'POST',
  })

  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' })
  }

  if (!response.ok) {
    const responseBody = await response.json()

    throw new Error(responseBody.reason ?? ERROR_MESSAGES.REQUEST_FAILED)
  }
}
