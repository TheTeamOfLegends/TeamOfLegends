import { Helmet } from 'react-helmet-async'
import { Box, Heading, Text } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'

import { Header } from '../../components/Header/Header'

export const ForumTopicPage = () => {
  const { topicId } = useParams<{ topicId: string }>()

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Топик форума</title>
        <meta name="description" content="Страница топика форума" />
      </Helmet>
      <Header />
      <Box p={10}>
        <Heading mb={4}>Топик форума #{topicId}</Heading>
        <Text>Здесь будет содержимое топика</Text>
      </Box>
    </div>
  )
}
