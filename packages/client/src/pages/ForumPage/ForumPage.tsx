import { Helmet } from 'react-helmet'
import { useSelector } from '../../store'
import { Header } from '../../components/Header/Header'
import { fetchForumThunk, selectForum } from '../../slices/forumSlice'
import { PageInitArgs } from '../../types'
import { usePage } from '../../hooks/usePage'
import {
  Container,
  Heading,
  Box,
  Flex,
  Text,
  Link as ChackraLink,
  Button,
} from '@chakra-ui/react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { StarPagination } from '../../components/StarPagination/StarPagination'

type datePlain = string | undefined | null

const formatDate = new Intl.DateTimeFormat('ru-RU', {
  year: '2-digit',
  month: '2-digit',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export const dateFormatter = (datePlain: datePlain) => {
  if (!datePlain) return ''

  const date = new Date(datePlain)

  if (isNaN(date.getDate())) return ''

  return formatDate.format(date)
}

const dateFormatterSpecial = (datePlain: datePlain) => {
  const dateFormatted = dateFormatter(datePlain)
  return dateFormatted ? `(${dateFormatted})` : ''
}

export const ForumPage = () => {
  // хук инициализации
  usePage({ initPage: initForumPage })

  const topics = useSelector(selectForum) ?? []
  const isLoading = useSelector(state => state.forum.isLoading)
  const navigate = useNavigate()

  const [searchParams] = useSearchParams()
  const pageNumber = Number(searchParams.get('page') ?? 1)

  const TOPICS_PER_PAGE = 8
  const topicsSliceStart = TOPICS_PER_PAGE * (pageNumber - 1)
  const topicsToShow =
    topics.length > topicsSliceStart
      ? topics.slice(topicsSliceStart, topicsSliceStart + TOPICS_PER_PAGE)
      : topics.slice(-TOPICS_PER_PAGE)

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Форум</title>
        <meta name="description" content="Форум приложения" />
      </Helmet>
      <Flex flexDirection={'column'} height="100vh">
        <Header />
        <Container p={'10'} bg={'gray.50'} flexGrow={1}>
          <Flex justifyContent={'space-between'}>
            <Heading mb={'2'}>Темы форума</Heading>
            {!isLoading && (
              <Button
                colorPalette={'pink'}
                onClick={() => navigate('topic/create')}>
                Новый топик
              </Button>
            )}
          </Flex>
          {isLoading && <Text>Загрузка...</Text>}
          {!isLoading && (
            <Flex flexDirection={'column'} gap={'2'}>
              {topicsToShow.map(topic => (
                <Box key={topic.id}>
                  <ChackraLink
                    asChild
                    color="blue.800"
                    fontWeight="semibold"
                    _hover={{
                      color: 'blue.700',
                      textDecoration: 'underline',
                    }}>
                    <Link to={`/forum/topic/${topic.id}`}>{topic.title}</Link>
                  </ChackraLink>
                  <Flex gapX={'2'} fontSize={'small'}>
                    <Text as={'span'}>
                      {[topic.author.name, topic.author.secondName].join(' ')}
                    </Text>
                    <Text as={'span'}>
                      {dateFormatterSpecial(topic.createdAt)}
                    </Text>
                  </Flex>
                </Box>
              ))}
              <Flex justifyContent={'center'}>
                <StarPagination
                  count={topics.length}
                  pageSize={TOPICS_PER_PAGE}
                  pageNumber={pageNumber}
                />
              </Flex>
            </Flex>
          )}
        </Container>
      </Flex>
    </div>
  )
}

export const initForumPage = async ({ dispatch, state }: PageInitArgs) => {
  const topics = selectForum(state)

  // Если данные уже есть в сторе, не фетчим снова
  if (topics) {
    return
  }

  return dispatch(fetchForumThunk())
}
