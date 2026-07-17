import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { SERVER_HOST } from '../constants'
import { User } from './userSlice'
import { Topic } from './forumSlice'
//TODO удалить после интеграции с апи
import { findTopic } from '../pages/ForumPage/topicsMock'
import { commentsMock } from '../pages/ForumTopicPage/commentsMock'

export interface ForumComment {
  id: number
  author: User
  body: string
  createdAt: string
}

interface ForumTopic {
  topic: Topic | null
  comments: ForumComment[]
}

interface ForumTopicState extends ForumTopic {
  isLoading: boolean
}

const initialState: ForumTopicState = {
  topic: null,
  comments: [],
  isLoading: true,
}

export const fetchForumTopicThunk = createAsyncThunk(
  'forumTopic/fetchForumTopicThunk',
  async (id: number) => {
    const topicUrl = `${SERVER_HOST}/topic/${id}`
    const commentsUrl = `${SERVER_HOST}/topic/${id}/comments`

    const [topicData, commentsData] = await Promise.all([
      fetch(topicUrl),
      fetch(commentsUrl),
    ])

    const topic = await topicData.json()
    const comments = await commentsData.json()

    return { topic, comments }
  }
)

export const ForumTopicSlice = createSlice({
  name: 'forumTopic',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchForumTopicThunk.pending, state => {
        state.topic = null
        state.comments = []
        state.isLoading = true
      })
      .addCase(
        fetchForumTopicThunk.fulfilled,
        (
          state,
          { payload }: PayloadAction<{ topic: Topic; comments: ForumComment[] }>
        ) => {
          state.topic = payload.topic
          state.comments = payload.comments
          state.isLoading = false
        }
      )
      .addCase(fetchForumTopicThunk.rejected, (state, action) => {
        state.isLoading = false
        //TODO удалить mock данные после интеграции с API
        const topicId = action.meta.arg
        state.topic = findTopic(topicId)
        state.comments = commentsMock(topicId)
      })
  },
})

export const selectForumActiveTopic = (state: RootState) =>
  state.forumActiveTopic

export default ForumTopicSlice.reducer
