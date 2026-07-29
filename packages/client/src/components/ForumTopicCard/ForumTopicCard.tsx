import { Avatar, Box, Flex, SimpleGrid, VStack } from '@chakra-ui/react'
import { dateFormatter } from '../../pages/ForumPage/ForumPage'
import { ReactNode } from 'react'
import { ForumAuthor, ForumComment, Topic } from '../../types/forum'

// Переделать на Avatar.Image когда его починяет
const AvatarImage = Avatar.Image as React.FC<
  React.ImgHTMLAttributes<HTMLImageElement>
>

interface ForumTopicCardProps {
  author: ForumAuthor
  children: ReactNode
}

export const ForumTopicCard = ({ author, children }: ForumTopicCardProps) => {
  return (
    <SimpleGrid
      gridTemplateColumns={'180px 1fr'}
      width={'100%'}
      bg={'gray.100'}
      py={8}>
      <VStack borderRightWidth="1px" borderRightColor="pink.500">
        <Avatar.Root boxSize="70px">
          {/* Fallback показывается, пока грузится картинка или если она битая */}
          <Avatar.Fallback name={`${author.name} ${author.secondName}`} />
          <AvatarImage
            src="/path/to/user/avatar"
            alt="user avatar"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Avatar.Root>
        <Box fontSize={'small'}>
          {[author.name, author.secondName].join(' ')}
        </Box>
      </VStack>
      <Flex flexDirection={'column'} gapY={'2'} px={8}>
        {children}
      </Flex>
    </SimpleGrid>
  )
}

export const ForumTopicCardBody = (props: ForumComment | Topic) => {
  return (
    <>
      <Box fontSize={'small'}>{dateFormatter(props.createdAt)}</Box>
      {'title' in props && props.title && (
        <Box fontWeight={'semibold'}>{props.title}</Box>
      )}
      <Box whiteSpace="pre-line">{props.body}</Box>
    </>
  )
}
