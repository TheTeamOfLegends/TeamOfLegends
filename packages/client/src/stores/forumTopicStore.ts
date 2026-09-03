import {
  removeCommentReaction as removeCommentReactionApi,
  removeTopicReaction as removeTopicReactionApi,
  setCommentReaction as setCommentReactionApi,
  setTopicReaction as setTopicReactionApi,
} from '@/api/reactionsApi'
import { create } from 'zustand'
import { SERVER_HOST } from '../constants'
import { findTopic } from '../pages/ForumPage/topicsMock'
import { commentsMock } from '../pages/ForumTopicPage/commentsMock'
import { ForumComment, Topic } from '../types/forum'
import { useProfileStore } from './profileStore'

interface ForumTopicState {
  topic: Topic | null
  comments: ForumComment[]
  isLoading: boolean
  loadTopic: (id: number) => Promise<void>
  setTopicReaction: (topicId: number, emoji: string) => Promise<void>
  removeTopicReaction: (topicId: number) => Promise<void>
  setCommentReaction: (commentId: number, emoji: string) => Promise<void>
  removeCommentReaction: (commentId: number) => Promise<void>
}

export const useForumTopicStore = create<ForumTopicState>((set, get) => ({
  topic: null,
  comments: [],
  isLoading: true,

  async loadTopic(id) {
    const current = get().topic

    if (current && current.id === id) {
      return
    }

    set({ topic: null, comments: [], isLoading: true })

    try {
      const [topicResponse, commentsResponse] = await Promise.all([
        fetch(`${SERVER_HOST}/forum/topic/${id}`),
        fetch(`${SERVER_HOST}/forum/topic/${id}/comments`),
      ])

      if (!topicResponse.ok || !commentsResponse.ok) {
        throw new Error('Forum topic request failed')
      }

      const topicData = (await topicResponse.json()) as {
        topic: Topic
        reactions: {
          emoji: string
          count: number
        }[]
      }

      const commentsData = (await commentsResponse.json()) as {
        comments: {
          count: number
          rows: ForumComment[]
        }
        reactions: {
          commentId: number
          reactions: {
            emoji: string
            count: number
          }[]
        }[]
      }

      const topic: Topic = {
        ...topicData.topic,
        reactions: topicData.reactions.map(reaction => ({
          ...reaction,
          reactedByMe: false,
        })),
      }

      const comments: ForumComment[] = commentsData.comments.rows.map(
        comment => {
          const commentReactions = commentsData.reactions.find(
            item => item.commentId === comment.id
          )

          return {
            ...comment,
            reactions:
              commentReactions?.reactions.map(reaction => ({
                ...reaction,
                reactedByMe: false,
              })) ?? [],
          }
        }
      )

      set({
        topic,
        comments,
        isLoading: false,
      })
    } catch {
      // TODO удалить mock данные после интеграции с API
      set({
        topic: findTopic(id),
        comments: commentsMock(id),
        isLoading: false,
      })
    }
  },

  async setTopicReaction(topicId, emoji) {
    const currentReaction = get().topic?.reactions.find(
      reaction => reaction.reactedByMe
    )

    if (currentReaction?.emoji === emoji) {
      await get().removeTopicReaction(topicId)
      return
    }

    const userId = useProfileStore.getState().user?.id

    if (!userId) {
      throw new Error('Пользователь не авторизован')
    }

    const data = await setTopicReactionApi(topicId, emoji, userId)

    set(state => ({
      topic:
        state.topic && state.topic.id === topicId
          ? {
              ...state.topic,
              reactions: data.reactions.map(reaction => ({
                ...reaction,
                reactedByMe: reaction.emoji === emoji,
              })),
            }
          : state.topic,
    }))
  },

  async removeTopicReaction(topicId) {
    const userId = useProfileStore.getState().user?.id

    if (!userId) {
      throw new Error('Пользователь не авторизован')
    }

    const data = await removeTopicReactionApi(topicId, userId)

    set(state => ({
      topic:
        state.topic && state.topic.id === topicId
          ? {
              ...state.topic,
              reactions: data.reactions,
            }
          : state.topic,
    }))
  },

  async setCommentReaction(commentId, emoji) {
    const currentReaction = get()
      .comments.find(comment => comment.id === commentId)
      ?.reactions.find(reaction => reaction.reactedByMe)

    if (currentReaction?.emoji === emoji) {
      await get().removeCommentReaction(commentId)
      return
    }

    const userId = useProfileStore.getState().user?.id

    if (!userId) {
      throw new Error('Пользователь не авторизован')
    }

    const data = await setCommentReactionApi(commentId, emoji, userId)

    set(state => ({
      comments: state.comments.map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              reactions: data.reactions.map(reaction => ({
                ...reaction,
                reactedByMe: reaction.emoji === emoji,
              })),
            }
          : comment
      ),
    }))
  },

  async removeCommentReaction(commentId) {
    const userId = useProfileStore.getState().user?.id

    if (!userId) {
      throw new Error('Пользователь не авторизован')
    }

    const data = await removeCommentReactionApi(commentId, userId)

    set(state => ({
      comments: state.comments.map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              reactions: data.reactions,
            }
          : comment
      ),
    }))
  },
}))
