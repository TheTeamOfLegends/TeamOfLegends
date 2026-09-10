import type { RequestHandler, Request, Response } from 'express'
import status from 'http-status'
import { ServerError } from '../../../shared/errors'
import * as service from './theme.service'

const VALID_THEMES = ['dark', 'light']

interface SaveUserThemeDto {
  theme: string
  guestId?: string
}

export const saveUserTheme: RequestHandler = async (
  { body, user }: Request<unknown, SaveUserThemeDto, SaveUserThemeDto>,
  res: Response<SaveUserThemeDto>,
  next
): Promise<void> => {
  const login = user?.login
  const { guestId, theme } = body

  if (!body.theme || !VALID_THEMES.includes(body.theme)) {
    return next(
      new ServerError(
        status.UNPROCESSABLE_ENTITY,
        `${body.theme} is invalid theme`
      )
    )
  }

  try {
    const userTheme = await service.saveUserTheme({ guestId, theme, login })

    res.status(status.OK).json(userTheme)
  } catch (error) {
    return next(error)
  }
}

interface GetUserThemeRequest {
  guestId?: string
}

interface GetUserThemeResponse extends GetUserThemeRequest {
  theme: string
}

export const getUserTheme: RequestHandler = async (
  {
    query,
    user,
  }: Request<unknown, GetUserThemeResponse, unknown, GetUserThemeRequest>,
  res: Response<GetUserThemeResponse>,
  next
): Promise<void> => {
  const login = user?.login
  const { guestId } = query

  if (!login && !guestId) {
    return next(
      new ServerError(
        status.UNPROCESSABLE_ENTITY,
        'Field login or guestId is required'
      )
    )
  }

  try {
    const userTheme = await service.getUserTheme({ guestId, login })

    if (!userTheme) {
      return next(new ServerError(status.NOT_FOUND, 'No user theme found'))
    }

    res.status(status.OK).json(userTheme)
  } catch (error) {
    return next(error)
  }
}
