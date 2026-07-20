import { API_BASE_URL } from '@/constants'
import { ERROR_MESSAGES } from '@/dictionary'
import {
  SignInFormValues,
  SignUpFormValues,
} from '@/utils/zod/validationSchema'

export const signIn = async (request: SignInFormValues) => {
  const response = await fetch(`${API_BASE_URL}/v2/auth/signin`, {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const responseBody = await response.json()

    throw new Error(responseBody.reason ?? ERROR_MESSAGES.REQUEST_FAILED)
  }
}

export const signUp = async (request: SignUpFormValues) => {
  const response = await fetch(`${API_BASE_URL}/v2/auth/signup`, {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const responseBody = await response.json()

    throw new Error(responseBody.reason ?? ERROR_MESSAGES.REQUEST_FAILED)
  }
}
