import { AppDispatch, RootState } from './store'

import { initMainPage, MainPage } from './pages/Main'
import { initFriendsPage, FriendsPage } from './pages/FriendsPage'
import { initNotFoundPage, NotFoundPage } from './pages/NotFound'
import { WithErrorPage } from './pages/WithError'
import { RouteError } from './components/Error/RouteError'

export type PageInitContext = {
  clientToken?: string
}

export type PageInitArgs = {
  dispatch: AppDispatch
  state: RootState
  ctx: PageInitContext
}

export const routes = [
  {
    path: '/',
    errorElement: <RouteError />,
    children: [
      {
        index: true,
        Component: MainPage,
        fetchData: initMainPage,
      },
      {
        path: 'friends',
        Component: FriendsPage,
        fetchData: initFriendsPage,
      },
      {
        path: 'withError',
        Component: WithErrorPage,
      },
    ],
  },
  {
    path: '*',
    Component: NotFoundPage,
    fetchData: initNotFoundPage,
  },
]
