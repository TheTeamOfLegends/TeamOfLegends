import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Header } from '../components/Header/Header'
import { Button } from '@chakra-ui/react'

export const WithErrorPage = () => {
  const [isError, setIsError] = useState(false)

  if (isError) {
    throw new Error('Произошла контролируемая ошибка')
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Главная</title>
        <meta
          name="withError"
          content="Страница, демонстрирующая перехват ошибки"
        />
      </Helmet>
      <Header />
      <div>
        <Button type="button" m={'30px'} onClick={() => setIsError(true)}>
          Получить ошибку
        </Button>
      </div>
    </>
  )
}
