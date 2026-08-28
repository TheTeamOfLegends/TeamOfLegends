import { Helmet } from 'react-helmet-async'
import { Header } from '../../components/Header/Header'
import { useSearchParams } from 'react-router-dom'
import { PageInitArgs } from '../../types'
import { Container, VStack, Flex, Text } from '@chakra-ui/react'
import { usePage } from '../../hooks/usePage'
import {
  ForumTopicCard,
  ForumTopicCardBody,
} from '../../components/ForumTopicCard/ForumTopicCard'
import { StarPagination } from '../../components/StarPagination/StarPagination'
import { ForumComment } from '../../types/forum'
import { ReactNode } from 'react'
import { CommentForm } from '../../components/CommentForm/CommentForm'
import { useForumTopicStore } from '../../stores/forumTopicStore'
import { useProfileStore } from '../../stores/profileStore'
import { ReactionBar } from '@/components/ReactionBar/ReactionBar'
import { Reaction } from '@/types/reaction'

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

const mockReactions: Reaction[] = [
  { emoji: '😀', count: 2, reactedByMe: false },
  { emoji: '😂', count: 4, reactedByMe: true },
  { emoji: '😍', count: 1, reactedByMe: false },
  { emoji: '😢', count: 3, reactedByMe: false },
]

export const ForumTopicPage = () => {
  usePage({ initPage: initForumTopicPage })

  const [searchParams] = useSearchParams()
  const pageNumber = Number(searchParams.get('page') ?? 1)

  const topic = useForumTopicStore(s => s.topic)
  const comments = useForumTopicStore(s => s.comments)
  const isLoading = useForumTopicStore(s => s.isLoading)
  const profileUser = useProfileStore(s => s.user)

  const setCommentReaction = useForumTopicStore(s => s.setCommentReaction)

  if (isLoading) {
    return (
      <ForumTopicContainer title="page is loading">
        <Text>Загрузка...</Text>
      </ForumTopicContainer>
    )
  }

  if (topic === null) {
    throw new Error('Не удалось загрузить данные')
  }

  const itemsLength = comments.length + 1
  const ITEMS_PER_PAGE = 10
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

  const commentAuthor = {
    name: profileUser?.first_name || profileUser?.login || 'User',
    secondName: profileUser?.second_name || '',
  }

  return (
    <ForumTopicContainer title={topic.title}>
      <VStack gapY={4} align={'flex-start'}>
        {pageNumber === 1 && (
          <ForumTopicCard author={topic.author}>
            <ForumTopicCardBody {...topic} />
            <ReactionBar
              reactions={topic.reactions}
              onReactionClick={emoji => setTopicReaction(topic.id, emoji)}
            />
          </ForumTopicCard>
        )}
        {itemsToShow.map(comment => (
          <ForumTopicCard author={comment.author} key={comment.id}>
            <ForumTopicCardBody {...comment} />
            <ReactionBar
              reactions={mockReactions}
              onReactionClick={emoji => setCommentReaction(comment.id, emoji)}
            />
          </ForumTopicCard>
        ))}
        <CommentForm author={commentAuthor} topicId={topic.id} />
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

export const initForumTopicPage = async ({ params }: PageInitArgs) => {
  const topicId = params.topicId

  if (!topicId) {
    return
  }

  return useForumTopicStore.getState().loadTopic(Number(topicId))
}
