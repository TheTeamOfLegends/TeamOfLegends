import { AppDispatch, RootState } from './store'

import {
  ChakraProvider,
  createSystem,
  defaultConfig,
  defineConfig,
} from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import { FriendsPage, initFriendsPage } from './pages/FriendsPage'
import { MainPage } from './pages/Main'
import { initNotFoundPage, NotFoundPage } from './pages/NotFound'
import { GlobalStyles } from './theme/GlobalStyles'

const config = defineConfig({
  theme: {},
})

const system = createSystem(defaultConfig, config)

const RootLayout = () => {
  return (
    <ChakraProvider value={system}>
      <GlobalStyles />
      <Outlet />
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

export const routes = [
  {
    path: '/',
    element: <RootLayout />,
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
        path: '*',
        Component: NotFoundPage,
        fetchData: initNotFoundPage,
      },
    ],
  },
]
