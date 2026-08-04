import { useEffect } from 'react'
import { useNavigate, useRouteError } from 'react-router-dom'
import { AppSpinner } from '../../ui/loader/app-spinner'

/**
 * errorElement для react-router: логирует ошибку маршрута
 * и перенаправляет на экран /500.
 */
export const RouteError = () => {
  const error = useRouteError()
  const navigate = useNavigate()

  useEffect(() => {
    console.error('В приложении произошла ошибка маршрута:', error)
    navigate('/500', { replace: true })
  }, [error, navigate])

  return <AppSpinner />
}
