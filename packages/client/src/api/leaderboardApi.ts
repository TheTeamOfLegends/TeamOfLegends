import { API_BASE_URL } from '@/constants'
import { ERROR_MESSAGES } from '@/dictionary'

const TEAM_NAME = '61_mf_teamwork_02_theteamoflegends'

export const LEADERBOARD_LIMIT = 10

export const SCORE_KEY = `score_${TEAM_NAME}`

export interface AddUserToLeaderboardRequest {
  data: {
    avatar?: string
    login: string
    [SCORE_KEY]: number
  }
  ratingFieldName: typeof SCORE_KEY
  teamName: typeof TEAM_NAME
}

export const addUserToLeaderboard = async (
  request: AddUserToLeaderboardRequest['data']
) => {
  const response = await fetch(`${API_BASE_URL}/v2/leaderboard`, {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: request,
      ratingFieldName: SCORE_KEY,
      teamName: TEAM_NAME,
    } satisfies AddUserToLeaderboardRequest),
  })

  if (!response.ok) {
    const responseBody = await response.json()

    throw new Error(responseBody.reason ?? ERROR_MESSAGES.REQUEST_FAILED)
  }
}

export interface GetLeaderboardRequest {
  ratingFieldName: typeof SCORE_KEY
  cursor: number
  limit: number
}

export type GetLeaderboardResponse = Array<{
  data: {
    avatar?: string
    login: string
    [SCORE_KEY]: number
  }
}>

export const getLeaderboard = async (
  request: Pick<GetLeaderboardRequest, 'cursor'>
): Promise<GetLeaderboardResponse> => {
  const response = await fetch(`${API_BASE_URL}/v2/leaderboard/all`, {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...request,
      limit: LEADERBOARD_LIMIT,
      ratingFieldName: SCORE_KEY,
    } satisfies GetLeaderboardRequest),
  })

  if (!response.ok) {
    const responseBody = await response.json()

    throw new Error(responseBody.reason ?? ERROR_MESSAGES.REQUEST_FAILED)
  }

  return response.json()
}
