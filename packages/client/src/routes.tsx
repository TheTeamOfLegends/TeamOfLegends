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
import { ForumPage, initForumPage } from './pages/ForumPage/ForumPage'
import { MainPage } from './pages/Main'
import { initNotFoundPage, NotFoundPage } from './pages/NotFound'
import { WithErrorPage } from './pages/WithError'
import { RouteError } from './components/Error/RouteError/RouteError'
import { SignInPage } from './pages/SignInPage/SignInPage'

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
        path: '/forum',
        Component: ForumPage,
        fetchData: initForumPage,
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
        path: '/withError',
        Component: WithErrorPage,
      },
      {
        path: '*',
        Component: NotFoundPage,
        fetchData: initNotFoundPage,
      },
      // Все остальные страницы добавляйте сюда:
      // { path: 'dashboard', Component: DashboardPage }
    ],
  },
]
