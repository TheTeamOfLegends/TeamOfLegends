export type ForumRelatedId = number | null

export type ForumUser = {
  id: number
}

export type ForumTopic = {
  id?: number
  title: string
  body: string
  author: ForumRelatedId
  isSticky?: boolean
}

export type ForumComment = {
  id?: number
  topicId: number
  body: string
  author: ForumRelatedId
  parentId?: ForumRelatedId
  replies?: ForumComment[]
}

export type DbTopic = Omit<ForumTopic, 'id' | 'isSticky'> & {
  id: number
  is_sticky: boolean
}

export type DbComment = Omit<ForumComment, 'id' | 'topicId' | 'parentId'> & {
  id: number
  topic_id: number
  parent_id: ForumRelatedId
}

export type ForumReaction = {
  id?: number
  emoji: string
  userId: number
  topicId: number
}
