import { oauthYandex } from '@/api/oauthApi'
import { toaster } from '@/components/ui/toaster'
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export const OAuthYandexCallbackPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const code = searchParams.get('code')

  useEffect(() => {
    if (code === null) {
      toaster.create({
        description: 'Авторизация отменена или не удалась',
        type: 'error',
      })
      navigate('/', { replace: true })
      return
    }

    const initYandexAuth = async () => {
      try {
        const response = await oauthYandex(code)

        if (!response.ok) {
          toaster.create({
            description: 'Ошибка авторизации через Яндекс',
            type: 'error',
          })
        }
      } catch (err) {
        toaster.create({
          description: 'Сетевая ошибка при авторизации',
          type: 'error',
        })
      }

      navigate('/', { replace: true })
    }

    initYandexAuth()
  }, [code, navigate])

  return <>Загрузка OAuth...</>
}
