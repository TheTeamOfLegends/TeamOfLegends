import { Helmet } from 'react-helmet-async'
import { Header } from '../../components/Header/Header'
import { useSearchParams } from 'react-router-dom'
import { PageInitArgs } from '../../types'
import {
  fetchForumTopicThunk,
  selectForumActiveTopic,
} from '../../slices/forumTopicSlice'
import { Container, VStack, Flex, Text } from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import { usePage } from '../../hooks/usePage'
import {
  ForumTopicCard,
  ForumTopicCardBody,
} from '../../components/ForumTopicCard/ForumTopicCard'
import { StarPagination } from '../../components/StarPagination/StarPagination'
import { ForumComment } from '../../slices/forumTopicSlice'
import { ReactNode } from 'react'
import { CommentForm } from '../../components/CommentForm/CommentForm'

interface ContainerProps {
  title: string
  children: ReactNode
}

const ForumTopicContainer = (props: ContainerProps) => {
  const MAX_TITLE_LENGTH = 60

  const title =
    props.title.length > MAX_TITLE_LENGTH
      ? props.title.slice(0, MAX_TITLE_LENGTH) + '...'
      : props.title

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <meta name="description" content={props.title} />
      </Helmet>
      <Flex flexDirection={'column'} height="100vh">
        <Header />
        <Container p={'10'} bg={'gray.50'} flexGrow={1}>
          {props.children}
        </Container>
      </Flex>
    </div>
  )
}

export const ForumTopicPage = () => {
  // хук инициализации
  usePage({ initPage: initForumTopicPage })

  const [searchParams] = useSearchParams()
  const pageNumber = Number(searchParams.get('page') ?? 1)

  const activeTopic = useSelector(selectForumActiveTopic)

  // Сюда мы попадаем при:
  // isLoading: true из initialState
  // .pending установил isLoading: true
  if (activeTopic.isLoading) {
    return (
      <ForumTopicContainer title="page is loading">
        <Text>Загрузка...</Text>
      </ForumTopicContainer>
    )
  }

  if (activeTopic.topic === null) {
    throw new Error('Не удалось загрузить данные')
  }

  const { topic, comments } = activeTopic

  // comments + 1st topic
  const itemsLength = comments.length + 1
  const ITEMS_PER_PAGE = 10
  // затык в том, что на первой странице мы отображаем (n - 1) комментарий из-за топика
  // на остальных страницах n
  let itemsToShow: ForumComment[]
  if (pageNumber === 1) {
    itemsToShow = comments.slice(0, ITEMS_PER_PAGE - 1)
  } else {
    const itemsSliceStart = ITEMS_PER_PAGE * (pageNumber - 1) - 1
    itemsToShow = comments.slice(
      itemsSliceStart,
      itemsSliceStart + ITEMS_PER_PAGE
    )
  }

  return (
    <ForumTopicContainer title={topic.title}>
      <VStack gapY={4} align={'flex-start'}>
        {pageNumber === 1 && (
          <ForumTopicCard author={topic.author}>
            <ForumTopicCardBody {...topic} />
          </ForumTopicCard>
        )}
        {itemsToShow.map(comment => (
          <ForumTopicCard author={comment.author} key={comment.id}>
            <ForumTopicCardBody {...comment} />
          </ForumTopicCard>
        ))}
        <CommentForm
          author={{ name: 'SomeCurrentUser', secondName: '' }}
          topicId={topic.id}
        />
        {itemsLength > ITEMS_PER_PAGE && (
          <Flex alignSelf={'center'}>
            <StarPagination
              count={itemsLength}
              pageSize={ITEMS_PER_PAGE}
              pageNumber={pageNumber}
            />
          </Flex>
        )}
      </VStack>
    </ForumTopicContainer>
  )
}

export const initForumTopicPage = async ({
  dispatch,
  state,
  params,
}: PageInitArgs) => {
  const topicId = params.topicId

  if (!topicId) {
    return
  }

  const activeTopic = selectForumActiveTopic(state)

  // Если данные уже есть в сторе, не фетчим снова
  if (activeTopic.topic && activeTopic.topic.id === Number(topicId)) {
    return
  }

  return dispatch(fetchForumTopicThunk(Number(topicId)))
}
