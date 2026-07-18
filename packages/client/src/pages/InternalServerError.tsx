import { ErrorPage } from '../layouts/ErrorPage'

export const InternalServerErrorPage = () => {
  return <ErrorPage errorCode="500" errorText="Внутренняя ошибка сервера" />
}
