import type { Request, Response, NextFunction } from 'express'

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const mockAuth = req.headers.authorization
  if (mockAuth && mockAuth === 'mock403') {
    return res
      .status(403)
      .json('Доступ запрещен. Реализация возложена на задачу №4')
  }

  req.user = {
    id: Number(req.body.userId),
  }

  next()
  return
}

export default authMiddleware
