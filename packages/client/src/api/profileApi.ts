import { toaster } from '@/components/ui/toaster'
import { API_BASE_URL } from '@/constants'
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/dictionary'

export const getProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/v2/auth/user`, {
    credentials: 'include',
  })

  if (!response.ok) {
    const body = await response.json()
    throw new Error(body.reason)
  }

  const user = await response.json()

  console.log('PROFILE', user)

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

  if (response.ok) {
    toaster.create({
      description: SUCCESS_MESSAGES.PASSWORD_CHANGE_SUCCESS,
      type: 'success',
    })
  } else {
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
    const body = await response.json()
    throw new Error(body.reason)
  }

  return response.json()
}
