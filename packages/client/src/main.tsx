import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { store } from './store'

import { routes } from './routes'

const router = createBrowserRouter(routes)

ReactDOM.hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
)
