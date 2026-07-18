import { Helmet } from 'react-helmet-async'
import { Box, Heading, Text } from '@chakra-ui/react'

import { Header } from '../../components/Header/Header'

export const GamePage = () => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Игра</title>
        <meta name="description" content="Страница игры" />
      </Helmet>
      <Header />
      <Box p={10}>
        <Heading mb={4}>Игра</Heading>
        <Text>Здесь будет игровой процесс</Text>
      </Box>
    </div>
  )
}
