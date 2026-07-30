import {
  ChakraProvider,
  createSystem,
  defaultConfig,
  defineConfig,
} from '@chakra-ui/react'
import { GlobalStyles } from './theme/GlobalStyles'
import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { AppSpinner } from './components/ui/loader/app-spinner'
import { Toaster } from './components/ui/toaster'
import { checkAuth } from './api/auth'
import { FriendsPage, initFriendsPage } from './pages/FriendsPage'
import { ForumPage, initForumPage } from './pages/ForumPage/ForumPage'
import { MainPage } from './pages/Main'
import { NotFoundPage } from './pages/NotFound'
import { InternalServerErrorPage } from './pages/InternalServerError'
import { WithErrorPage } from './pages/WithError'
import { RouteError } from './components/Error/RouteError/RouteError'
import { SignInPage } from './pages/SignInPage/SignInPage'
import {
  ForumNewTopicPage,
  newTopicCreateAction,
} from './pages/ForumNewTopicPage/ForumNewTopicPage'
import {
  ForumTopicPage,
  initForumTopicPage,
} from './pages/ForumTopicPage/ForumTopicPage'
import { newCommentCreateAction } from './components/CommentForm/CommentForm'
import { SignUpPage } from './pages/SignUpPage/SignUpPage'
import { ProfilePage, initProfilePage } from './pages/Profile/ProfilePage'
import { GamePage } from './pages/GamePage/GamePage'
import { LeaderboardPage } from './pages/LeaderboardPage/LeaderboardPage'
import { GameOverPage } from './pages/GameOverPage/GameOverPage'
import { useProfileStore } from './stores/profileStore'

const config = defineConfig({
  theme: {},
})

const system = createSystem(defaultConfig, config)

const RootLayout = () => {
  return (
    <ChakraProvider value={system}>
      <GlobalStyles />
      <Outlet />
      <Toaster />
    </ChakraProvider>
  )
}

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const user = useProfileStore(s => s.user)

  useEffect(() => {
    let cancelled = false

    checkAuth().then(isAuth => {
      if (cancelled) return

      setIsAuthenticated(isAuth)
      setIsLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [user?.id])

  return { isAuthenticated, isLoading }
}

/** Страницы только для гостей (вход / регистрация) */
export const GuestOnlyGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isLoading, isAuthenticated, navigate])

  if (isLoading) {
    return <AppSpinner />
  }

  return <>{children}</>
}

/** Защищённые страницы: без авторизации редирект на /sign-in */
export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/sign-in', { replace: true })
    }
  }, [isLoading, isAuthenticated, navigate])

  if (isLoading) {
    return <AppSpinner />
  }

  return <>{children}</>
}

export const routes = [
  {
    path: '/',
    element: <RootLayout />,
    errorElement: (
      <ChakraProvider value={system}>
        <RouteError />
      </ChakraProvider>
    ),
    children: [
      {
        path: '/sign-in',
        element: (
          <GuestOnlyGuard>
            <SignInPage />
          </GuestOnlyGuard>
        ),
      },
      {
        path: '/sign-up',
        element: (
          <GuestOnlyGuard>
            <SignUpPage />
          </GuestOnlyGuard>
        ),
      },
      {
        element: (
          <AuthGuard>
            <Outlet />
          </AuthGuard>
        ),
        children: [
          {
            path: '/',
            Component: MainPage,
          },
          {
            path: '/friends',
            Component: FriendsPage,
            fetchData: initFriendsPage,
          },
          {
            path: '/profile',
            Component: ProfilePage,
            fetchData: initProfilePage,
          },
          {
            path: '/game',
            Component: GamePage,
          },
          {
            path: '/leaderboard',
            Component: LeaderboardPage,
          },
          {
            path: '/forum',
            children: [
              {
                index: true,
                Component: ForumPage,
                fetchData: initForumPage,
              },
              {
                path: 'topic/create',
                Component: ForumNewTopicPage,
                action: newTopicCreateAction,
              },
              {
                path: 'topic/:topicId/comment/new',
                action: newCommentCreateAction,
              },
              {
                path: 'topic/:topicId',
                Component: ForumTopicPage,
                fetchData: initForumTopicPage,
              },
            ],
          },
          {
            path: '/withError',
            Component: WithErrorPage,
          },
          {
            path: '/500',
            Component: InternalServerErrorPage,
          },
          {
            path: '*',
            Component: NotFoundPage,
          },
        ],
      },
      {
        path: '/game-over',
        Component: GameOverPage,
      },
      // Все остальные страницы добавляйте сюда:
      // { path: 'dashboard', Component: DashboardPage }
    ],
  },
]
