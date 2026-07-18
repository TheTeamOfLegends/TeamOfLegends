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
import { API_BASE_URL } from './constants'
import { FriendsPage, initFriendsPage } from './pages/FriendsPage'
import { MainPage } from './pages/Main'
import { NotFoundPage } from './pages/NotFound'
import { InternalServerErrorPage } from './pages/InternalServerError'
import { WithErrorPage } from './pages/WithError'
import { RouteError } from './components/Error/RouteError/RouteError'
import { SignInPage } from './pages/SignInPage/SignInPage'
import { SignUpPage } from './pages/SignUpPage/SignUpPage'
import { ProfilePage } from './pages/ProfilePage/ProfilePage'
import { GamePage } from './pages/GamePage/GamePage'
import { LeaderboardPage } from './pages/LeaderboardPage/LeaderboardPage'
import { ForumPage } from './pages/ForumPage/ForumPage'
import { ForumTopicPage } from './pages/ForumTopicPage/ForumTopicPage'
import { initProfilePage } from './pages/Profile/ProfilePage'

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

export const GuestOnlyGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const isAutheticated = async () => {
      try {
        setIsLoading(true)

        const response = await fetch(`${API_BASE_URL}/v2/auth/user`, {
          credentials: 'include',
        })

        return response.ok
      } catch (error) {
        return false
      } finally {
        setIsLoading(false)
      }
    }

    isAutheticated().then(result => {
      if (result) {
        navigate('/')
      }
    })
  }, [navigate])

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
        path: '/profile',
        Component: ProfilePage,
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
      {
        path: '/leaderboard',
        Component: LeaderboardPage,
      },
    ],
  },
]
