/**
 * В routes.tsx у нас было:
 * import { initSomePage } from './pages/SomePage'
 * В SomePage.tsx у нас было:
 * import { PageInitArgs } from '../routes'
 * Круговерть... Разорвем ее.
 */
import { AppDispatch, RootState } from './store'

export type PageInitContext = {
  clientToken?: string
}

export type PageInitArgs = {
  dispatch: AppDispatch
  state: RootState
  ctx: PageInitContext
  params: Record<string, string | undefined>
}
