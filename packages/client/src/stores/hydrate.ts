import { useFriendsStore } from './friendsStore'
import { useForumStore } from './forumStore'
import { useForumTopicStore } from './forumTopicStore'
import { useProfileStore } from './profileStore'
import { useSsrStore } from './ssrStore'
import { Friend } from './friendsStore'
import { ForumComment, Topic } from '../types/forum'
import { User } from '../types/user'

export type AppInitialState = {
  ssr: {
    initializedPath: string | null
  }
  friends: {
    data: Friend[]
    isLoading: boolean
  }
  forum: {
    topics: Topic[] | null
    isLoading: boolean
  }
  forumTopic: {
    topic: Topic | null
    comments: ForumComment[]
    isLoading: boolean
  }
  profile: {
    user: User | null
    isLoading: boolean
  }
}

declare global {
  interface Window {
    APP_INITIAL_STATE?: AppInitialState
  }
}

export const resetStoresForSsr = () => {
  useSsrStore.setState({ initializedPath: null })
  useFriendsStore.setState({ data: [], isLoading: false })
  useForumStore.setState({ topics: null, isLoading: false })
  useForumTopicStore.setState({
    topic: null,
    comments: [],
    isLoading: true,
  })
  useProfileStore.setState({ user: null, isLoading: false })
}

export const getAppInitialState = (): AppInitialState => {
  const ssr = useSsrStore.getState()
  const friends = useFriendsStore.getState()
  const forum = useForumStore.getState()
  const forumTopic = useForumTopicStore.getState()
  const profile = useProfileStore.getState()

  return {
    ssr: {
      initializedPath: ssr.initializedPath,
    },
    friends: {
      data: friends.data,
      isLoading: friends.isLoading,
    },
    forum: {
      topics: forum.topics,
      isLoading: forum.isLoading,
    },
    forumTopic: {
      topic: forumTopic.topic,
      comments: forumTopic.comments,
      isLoading: forumTopic.isLoading,
    },
    profile: {
      user: profile.user,
      isLoading: profile.isLoading,
    },
  }
}

export const hydrateStores = (state?: AppInitialState) => {
  if (!state) {
    return
  }

  useSsrStore.setState(state.ssr)
  useFriendsStore.setState(state.friends)
  useForumStore.setState(state.forum)
  useForumTopicStore.setState(state.forumTopic)
  useProfileStore.setState(state.profile)
}
