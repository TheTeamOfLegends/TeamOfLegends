import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { SERVER_HOST } from '../constants'
import { User } from './userSlice'
import { topicsMock } from '../pages/ForumPage/topicsMock'

export interface Topic {
  id: number
  title: string
  body: string
  author: User
  createdAt: string | null | undefined
}

interface Forum {
  topics: Topic[]
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
      .addCase(fetchForumThunk.pending, state => {
        state.topics = []
        state.isLoading = true
      })
      .addCase(
        fetchForumThunk.fulfilled,
        (state, { payload }: PayloadAction<Forum['topics']>) => {
          state.topics = payload
          state.isLoading = false
        }
      )
      .addCase(fetchForumThunk.rejected, state => {
        state.isLoading = false
        //TODO удалить mock данные после интеграции с API
        state.topics = topicsMock
      })
  },
})

export const selectForum = (state: RootState) => state.forum.topics

export default forumSlice.reducer
