import type { Request, Response, NextFunction } from 'express'

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const mockAuth = req.headers.authorization
  if (mockAuth && mockAuth === 'mock403') {
    return res
      .status(403)
      .json('Доступ запрещен. Реализация возложена на задачу №4')
  }

  const rawId = req.body.userId || req.query.userId || req.headers['x-user-id']
  if (rawId) {
    req.user = { id: Number(rawId) }
  }

  next()
  return
}

export default authMiddleware
