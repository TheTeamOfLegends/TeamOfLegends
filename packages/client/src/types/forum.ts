import { Reaction } from './reaction'

export type ForumAuthor = {
  name: string
  secondName: string
}

export type ForumComment = {
  id: number
  author: ForumAuthor
  body: string
  createdAt: string | null | undefined
  reactions: Reaction[]
}

export type Topic = ForumComment & {
  title: string
}
