import { Box, Flex, HStack, Text } from '@chakra-ui/react'
import { LeaderboardEntry } from './types'
import { formatScore } from './utils'
import { getRowStyles, placeColStyles } from './LeaderboardRow.styles'
import { PlayerAvatar } from './PlayerAvatar'

type Props = {
  entry: LeaderboardEntry
}

export const LeaderboardRow = ({ entry }: Props) => (
  <Flex {...getRowStyles(entry.isCurrentUser)}>
    <Box {...placeColStyles} color="white">
      {entry.place}
    </Box>

    <HStack flex={1} px={4} gap={3} minW={0}>
      <PlayerAvatar login={entry.login} avatarUrl={entry.avatarUrl} />
      <Text color="white" truncate>
        {entry.login}
      </Text>
    </HStack>

    <Box
      flex={1}
      px={4}
      color="white"
      fontWeight={entry.isCurrentUser ? 'bold' : 'normal'}>
      {formatScore(entry.score)}
    </Box>
  </Flex>
)
