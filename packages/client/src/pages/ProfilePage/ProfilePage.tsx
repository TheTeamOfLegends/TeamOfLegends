import { Helmet } from 'react-helmet'
import { Box, Heading, Text } from '@chakra-ui/react'

import { Header } from '../../components/Header/Header'

export const ProfilePage = () => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Профиль</title>
        <meta name="description" content="Страница профиля" />
      </Helmet>
      <Header />
      <Box p={10}>
        <Heading mb={4}>Профиль</Heading>
        <Text>Здесь будет информация о профиле пользователя</Text>
      </Box>
    </div>
  )
}
