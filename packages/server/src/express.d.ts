import type { ForumUser } from './types'

declare global {
  namespace Express {
    interface Request {
      user: ForumUser
    }
  }
}

export {}
