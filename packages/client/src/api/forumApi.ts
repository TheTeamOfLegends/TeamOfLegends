import { SERVER_HOST } from '@/constants'
import { ForumAuthor, ForumComment, Topic } from '@/types/forum'

const FORUM_BASE = `${SERVER_HOST}/forum`

type ApiTopic = {
  id: number
  title: string
  body: string
  author: number | null
  createdAt?: string | null
  isSticky?: boolean
}

type ApiComment = {
  id: number
  topicId: number
  body: string
  author: number | null
  parentId?: number | null
  createdAt?: string | null
}

const authorFromId = (authorId: number | null | undefined): ForumAuthor => ({
  name: authorId != null ? `User` : 'Anon',
  secondName: authorId != null ? `#${authorId}` : '',
})

const mapTopic = (t: ApiTopic): Topic => ({
  id: t.id,
  title: t.title,
  body: t.body,
  author: authorFromId(t.author),
  createdAt: t.createdAt ?? null,
})

const mapComment = (c: ApiComment): ForumComment => ({
  id: c.id,
  body: c.body,
  author: authorFromId(c.author),
  createdAt: c.createdAt ?? null,
})

async function forumFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${FORUM_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  if (!response.ok) {
    throw new Error(`Forum API ${response.status}: ${path}`)
  }

  return response.json() as Promise<T>
}

export const getTopics = async (): Promise<Topic[]> => {
  const data = await forumFetch<{ rows: ApiTopic[]; count: number }>('/topics')
  return data.rows.map(mapTopic)
}

export const getTopic = async (id: number): Promise<Topic> => {
  const data = await forumFetch<{ topic: ApiTopic }>(`/topic/${id}`)
  return mapTopic(data.topic)
}

export const getComments = async (topicId: number): Promise<ForumComment[]> => {
  const data = await forumFetch<{
    comments: { rows: ApiComment[]; count: number }
  }>(`/topic/${topicId}/comments?view=plain`)

  return data.comments.rows.map(mapComment)
}

export const createTopic = async (payload: {
  title: string
  body: string
  userId: number
}): Promise<Topic> => {
  const data = await forumFetch<{ newTopic: ApiTopic }>('/topic/create', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return mapTopic(data.newTopic)
}

export const createComment = async (payload: {
  topicId: number
  body: string
  userId: number
}): Promise<ForumComment> => {
  const data = await forumFetch<{ newComment: ApiComment }>('/comment/create', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return mapComment(data.newComment)
}
