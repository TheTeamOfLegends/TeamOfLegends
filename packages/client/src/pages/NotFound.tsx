import { ErrorPage } from '../layouts/ErrorPage'

export const NotFoundPage = () => {
  return <ErrorPage errorCode="404" errorText="Страница не найдена" />
}
