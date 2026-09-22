import type { NextFunction, Request, Response } from 'express'

// TODO пока настоящая аутентификация не реализована, будем считать, что пришедший токен - это логин
// пользователя. Позже должно вычитываться, например, из JWT.
const getUserData = (token: string) => {
  return {
    id: 0,
    login: token,
  }
}

export const optionalAuthMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization
    const isGuest = !authHeader || !authHeader.startsWith('Bearer ')

    if (isGuest) {
      return next()
    }

    const token = authHeader.split(' ')[1]

    req.user = getUserData(token)

    next()
  } catch (error) {
    next()
  }
}
