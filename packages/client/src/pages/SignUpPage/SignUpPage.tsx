import { Helmet } from 'react-helmet'
import { Box, Heading, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

import { Header } from '../../components/Header/Header'

export const SignUpPage = () => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Регистрация</title>
        <meta name="description" content="Страница регистрации" />
      </Helmet>
      <Header />
      <Box p={10}>
        <Heading mb={4}>Регистрация</Heading>
        <Text mb={4}>Здесь будет форма регистрации</Text>
        <Link to="/sign-in">Уже есть аккаунт? Войти</Link>
      </Box>
    </div>
  )
}
