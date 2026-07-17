import { Helmet } from 'react-helmet'
import { Box, Heading, Text } from '@chakra-ui/react'

import { Header } from '../../components/Header/Header'

export const LeaderboardPage = () => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Лидерборд</title>
        <meta name="description" content="Страница лидерборда" />
      </Helmet>
      <Header />
      <Box p={10}>
        <Heading mb={4}>Лидерборд</Heading>
        <Text>Здесь будет таблица лидеров</Text>
      </Box>
    </div>
  )
}
