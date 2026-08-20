import { API_BASE_URL, OAUTH_URL } from '@/constants'
import { ERROR_MESSAGES } from '@/dictionary'

export const oauthGetClientId = async () => {
  const url = `${API_BASE_URL}/v2/oauth/yandex/service-id`
  const params = {
    redirect_uri: getRedirectUri(),
  }

  const queryString = new URLSearchParams(params).toString()

  const response = await fetch(`${url}?${queryString}`)
  const responseBody = await response.json()

  if (!response.ok) {
    throw new Error(responseBody.reason ?? ERROR_MESSAGES.REQUEST_FAILED)
  }

  const clientId = responseBody.service_id

  if (typeof clientId !== 'string') {
    throw new Error(ERROR_MESSAGES.REQUEST_FAILED)
  }

  return clientId
}

export const oauthRedirect = (clientId: string) => {
  const params = {
    response_type: 'code',
    client_id: clientId,
    redirect_uri: getRedirectUri(),
  }

  const queryString = new URLSearchParams(params)
  const url = `${OAUTH_URL}?${queryString}`

  window.location.href = url
}

export const oauthYandex = async (code: string) => {
  const params = {
    code,
    redirect_uri: getRedirectUri(),
  }

  const response = await fetch(`${API_BASE_URL}/v2/oauth/yandex`, {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })

  return response
}

const getRedirectUri = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  return ''
}
