import {
  ChakraProvider,
  createSystem,
  defaultConfig,
  defineConfig,
} from '@chakra-ui/react'
import { CacheProvider } from '@emotion/react'
import { GlobalStyles } from './theme/GlobalStyles'
import { useEffect, useState, type ReactNode } from 'react'
import {
  LoaderFunctionArgs,
  Outlet,
  redirect,
  useLocation,
  Navigate,
} from 'react-router-dom'
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
import { ErrorBoundary } from './components/Error/ErrorBoundary/ErrorBoundary'
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
import { useProfileStore } from './stores/profileStore'
import { OAuthYandexCallbackPage } from './pages/OAuth/OAuthYandex'
import { clientEmotionCache } from './emotion/createEmotionCache'

const config = defineConfig({
  theme: {},
})

const system = createSystem(defaultConfig, config)

/**
 * На SSR CacheProvider уже есть в entry-server (тот же кеш, из которого
 * extractCritical забирает стили). Вложенный второй кеш ломал CSS кнопок/инпутов.
 * На клиенте нужен свой singleton для гидратации.
 */
const withEmotionCache = (node: ReactNode) =>
  clientEmotionCache ? (
    <CacheProvider value={clientEmotionCache}>{node}</CacheProvider>
  ) : (
    <>{node}</>
  )

const RootLayout = () => {
  const location = useLocation()

  return withEmotionCache(
    <ChakraProvider value={system}>
      {/* key сбрасывает boundary после перехода на /500 или другую страницу */}
      <ErrorBoundary key={location.pathname}>
        <GlobalStyles />
        <Outlet />
        <Toaster />
      </ErrorBoundary>
    </ChakraProvider>
  )
}

/**
 * На SSR не блокируем разметку спиннером: пользователь уже подтянут в entry-server.
 * На клиенте спиннер только пока идёт первая проверка и нет гидрированного user.
 */
export const useAuth = () => {
  const user = useProfileStore(s => s.user)
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(user))
  const [isLoading, setIsLoading] = useState(
    () => typeof window !== 'undefined' && !user
  )

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true)
      setIsLoading(false)
    }
  }, [user])

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
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <AppSpinner />
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

/** Защищённые страницы: без авторизации редирект на /sign-in */
export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <AppSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />
  }

  return <>{children}</>
}

/**
 * При наличии oauth кода перенаправляем пользователя на callback страницу
 */
const checkOAuthCode = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')

  if (code) {
    return redirect(`/callback/oauth/yandex${url.search}`)
  }

  return null
}

export const routes = [
  {
    path: '/',
    element: <RootLayout />,
    errorElement: withEmotionCache(
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
            loader: checkOAuthCode,
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
            path: '*',
            Component: NotFoundPage,
          },
        ],
      },
      {
        path: '/500',
        Component: InternalServerErrorPage,
      },
      {
        path: '/callback/oauth/yandex',
        Component: OAuthYandexCallbackPage,
      },
      // Все остальные страницы добавляйте сюда:
      // { path: 'dashboard', Component: DashboardPage }
    ],
  },
]
