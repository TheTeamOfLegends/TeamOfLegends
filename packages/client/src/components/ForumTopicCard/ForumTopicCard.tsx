import { Avatar, Box, Flex, SimpleGrid, VStack } from '@chakra-ui/react'
import { User } from '../../slices/userSlice'
import { dateFormatter } from '../../pages/ForumPage/ForumPage'

// Удалить и переделать на Avatar.Image когда его починяет
const AvatarImage = Avatar.Image as React.FC<
  React.ImgHTMLAttributes<HTMLImageElement>
>

interface ForumTopicCardProps {
  id: number
  title?: string
  author: User
  body: string
  createdAt: string | null | undefined
}

export const ForumTopicCard = ({
  title,
  author,
  body,
  createdAt,
}: ForumTopicCardProps) => {
  return (
    <SimpleGrid gridTemplateColumns={'180px 1fr'}>
      <VStack>
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
      <Flex flexDirection={'column'} gapY={'2'}>
        <Box fontSize={'small'}>{dateFormatter(createdAt)}</Box>
        {title && <Box fontWeight={'semibold'}>{title}</Box>}
        <Box whiteSpace="pre-line">{body}</Box>
      </Flex>
    </SimpleGrid>
  )
}
