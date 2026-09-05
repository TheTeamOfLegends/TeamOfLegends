import type { Request, RequestHandler, Response } from 'express'
import status from 'http-status'
import { ServerError } from '../../../shared/errors'
import * as service from './theme.service'

interface SaveUserThemeDto {
  theme: string
  login?: string
  guestId?: string
}

export const saveUserTheme: RequestHandler = async (
  { body }: Request<unknown, SaveUserThemeDto, SaveUserThemeDto>,
  res: Response<SaveUserThemeDto>,
  next
): Promise<void> => {
  if (!body.theme) {
    return next(
      new ServerError(status.UNPROCESSABLE_ENTITY, 'Field theme is required')
    )
  }

  try {
    const userTheme = await service.saveUserTheme(body)

    res.status(status.OK).json(userTheme)
  } catch (error) {
    return next(error)
  }
}

interface GetUserThemeRequest {
  login?: string
  guestId?: string
}

interface GetUserThemeResponse extends GetUserThemeRequest {
  theme: string
}

export const getUserTheme: RequestHandler = async (
  {
    query,
  }: Request<unknown, GetUserThemeResponse, unknown, GetUserThemeRequest>,
  res: Response<GetUserThemeResponse>,
  next
): Promise<void> => {
  if (!query.login && !query.guestId) {
    return next(
      new ServerError(
        status.UNPROCESSABLE_ENTITY,
        'Field login or guestId is required'
      )
    )
  }

  try {
    const userTheme = await service.getUserTheme(query)

    if (!userTheme) {
      return next(new ServerError(status.NOT_FOUND, 'No user theme found'))
    }

    res.status(status.OK).json(userTheme)
  } catch (error) {
    return next(error)
  }
}
