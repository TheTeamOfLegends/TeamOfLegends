import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from './theme/ThemeContext'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { hydrateStores } from './stores/hydrate'

import { routes } from './routes'
import registerSW from './service-workers/registerSW'

registerSW() // init serviceWorkers

hydrateStores(
  typeof window === 'undefined' ? undefined : window.APP_INITIAL_STATE
)

const router = createBrowserRouter(routes)

/**
 * Ловит ошибки вне дерева роутера (провайдеры и т.п.).
 * Внутри RouterProvider сработают ErrorBoundary / errorElement → /500.
 */
window.addEventListener('error', event => {
  console.error('Неперехваченная ошибка:', event.error ?? event.message)
})

window.addEventListener('unhandledrejection', event => {
  console.error('Необработанный Promise rejection:', event.reason)
})

ReactDOM.hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </HelmetProvider>
  </StrictMode>
)
