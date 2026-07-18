import { AppDispatch, RootState } from './store'

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
import { MainPage } from './pages/Main'
import { NotFoundPage } from './pages/NotFound'
import { InternalServerErrorPage } from './pages/InternalServerError'
import { WithErrorPage } from './pages/WithError'
import { RouteError } from './components/Error/RouteError/RouteError'
import { SignInPage } from './pages/SignInPage/SignInPage'
import { SignUpPage } from './pages/SignUpPage/SignUpPage'
import { ProfilePage, initProfilePage } from './pages/Profile/ProfilePage'
import { GamePage } from './pages/GamePage/GamePage'
import { LeaderboardPage } from './pages/LeaderboardPage/LeaderboardPage'
import { ForumPage } from './pages/ForumPage/ForumPage'
import { ForumTopicPage } from './pages/ForumTopicPage/ForumTopicPage'

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

export type PageInitContext = {
  clientToken?: string
}

export type PageInitArgs = {
  dispatch: AppDispatch
  state: RootState
  ctx: PageInitContext
}

/** Страницы только для гостей (вход / регистрация) */
export const GuestOnlyGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    checkAuth().then(isAuthenticated => {
      if (cancelled) {
        return
      }

      if (isAuthenticated) {
        navigate('/', { replace: true })
        return
      }

      setIsReady(true)
    })

    return () => {
      cancelled = true
    }
  }, [navigate])

  if (!isReady) {
    return <AppSpinner />
  }

  return <>{children}</>
}

/** Защищённые страницы: без авторизации редирект на /sign-in */
export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    let cancelled = false

    checkAuth().then(result => {
      if (cancelled) {
        return
      }

      if (!result) {
        navigate('/sign-in', { replace: true })
        return
      }

      setIsAuthenticated(true)
    })

    return () => {
      cancelled = true
    }
  }, [navigate])

  if (!isAuthenticated) {
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
            Component: ForumPage,
          },
          {
            path: '/forum/:topicId',
            Component: ForumTopicPage,
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
    ],
  },
]
