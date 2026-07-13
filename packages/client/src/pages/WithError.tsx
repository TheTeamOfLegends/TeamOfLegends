import { useState } from 'react'
import { Helmet } from 'react-helmet'
import { Header } from '../components/Header'
import styled from 'styled-components'

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
        <button type="button" onClick={() => setIsError(true)}>
          Получить ошибку
        </button>
      </div>
    </>
  )
}
