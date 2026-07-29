import ReactDOM from 'react-dom/server'
import { ServerStyleSheet } from 'styled-components'
import { HelmetProvider, type HelmetServerState } from 'react-helmet-async'
import { Request as ExpressRequest } from 'express'
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from 'react-router-dom/server'
import { matchRoutes } from 'react-router-dom'

import {
  createContext,
  createFetchRequest,
  createUrl,
} from './entry-server.utils'
import { routes } from './routes'
import './index.css'
import { getAppInitialState, resetStoresForSsr } from './stores/hydrate'
import { useSsrStore } from './stores/ssrStore'

export const render = async (req: ExpressRequest) => {
  resetStoresForSsr()

  const { query, dataRoutes } = createStaticHandler(routes)
  const fetchRequest = createFetchRequest(req)
  const context = await query(fetchRequest)

  if (context instanceof Response) {
    throw context
  }

  const url = createUrl(req)

  const foundRoutes = matchRoutes(routes, url)

  if (!foundRoutes) {
    throw new Error('Страница не найдена!')
  }

  // Берем последний элемент массива
  // (это самый конкретный маршрут, например, /forum или /sign-in, а не '/')
  const lastMatch = foundRoutes[foundRoutes.length - 1]
  const fetchData =
    'fetchData' in lastMatch.route ? lastMatch.route.fetchData : null

  let pageHasBeenInitializedOnServer = false

  // Вызываем только если это действительно функция
  if (typeof fetchData === 'function') {
    try {
      await fetchData({
        ctx: createContext(req),
        params: lastMatch.params,
      })

      pageHasBeenInitializedOnServer = true
    } catch (e) {
      console.log('Инициализация страницы произошла с ошибкой', e)
    }
  }

  useSsrStore
    .getState()
    .setPageHasBeenInitializedOnServer(pageHasBeenInitializedOnServer)

  const router = createStaticRouter(dataRoutes, context)
  const sheet = new ServerStyleSheet()
  const helmetContext: { helmet?: HelmetServerState } = {}

  try {
    const html = ReactDOM.renderToString(
      sheet.collectStyles(
        <HelmetProvider context={helmetContext}>
          <StaticRouterProvider router={router} context={context} />
        </HelmetProvider>
      )
    )
    const styleTags = sheet.getStyleTags()
    const helmet = helmetContext.helmet

    if (!helmet) {
      throw new Error('Helmet context is empty')
    }

    return {
      html,
      helmet,
      styleTags,
      initialState: getAppInitialState(),
    }
  } finally {
    sheet.seal()
  }
}
