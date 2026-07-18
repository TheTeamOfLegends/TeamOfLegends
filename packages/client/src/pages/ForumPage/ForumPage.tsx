import { Helmet } from 'react-helmet-async'
import { Box, Heading, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

import { Header } from '../../components/Header/Header'

export const ForumPage = () => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Форум</title>
        <meta name="description" content="Страница форума" />
      </Helmet>
      <Header />
      <Box p={10}>
        <Heading mb={4}>Форум</Heading>
        <Text mb={4}>Здесь будет список топиков форума</Text>
        <ul>
          <li>
            <Link to="/forum/1">Пример топика #1</Link>
          </li>
        </ul>
      </Box>
    </div>
  )
}
