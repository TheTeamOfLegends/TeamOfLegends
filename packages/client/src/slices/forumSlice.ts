import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { SERVER_HOST } from '../constants'
import { User } from './userSlice'
import { topicsMock } from '../pages/ForumPage/topicsMock'

export interface Topic {
  id: number
  title: string
  author: User
  createdAt: string
}

interface Forum {
  topics: Partial<Topic>[]
}

export interface ForumState {
  topics: Forum['topics'] | null
  isLoading: boolean
}

const initialState: ForumState = {
  topics: null,
  isLoading: false,
}

export const fetchForumThunk = createAsyncThunk(
  'forum/fetchForumThunk',
  async (_: void) => {
    const url = `${SERVER_HOST}/api/forum`
    return fetch(url).then(res => res.json())
  }
)

export const forumSlice = createSlice({
  name: 'forum',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchForumThunk.pending.type, state => {
        state.topics = []
        state.isLoading = true
      })
      .addCase(
        fetchForumThunk.fulfilled.type,
        (state, { payload }: PayloadAction<Forum['topics']>) => {
          state.topics = payload
          state.isLoading = false
        }
      )
      .addCase(fetchForumThunk.rejected.type, state => {
        //TODO удалить mock данные после интеграции с API
        state.topics = topicsMock
        state.isLoading = false
      })
  },
})

export const selectForum = (state: RootState) => state.forum.topics

export default forumSlice.reducer
