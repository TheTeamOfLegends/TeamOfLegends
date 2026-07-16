import { Flex, HStack, Text } from '@chakra-ui/react'
import { LeaderboardEntry } from '../../pages/LeaderboardPage/types'
import { formatScore } from '../../pages/LeaderboardPage/utils'
import { ACCENT, bannerStyles } from './LeaderboardBanner.styles'
import { PlayerAvatar } from './PlayerAvatar'

type Props = {
  entry: LeaderboardEntry
}

export const LeaderboardBanner = ({ entry }: Props) => (
  <Flex {...bannerStyles}>
    <HStack gap={3}>
      <PlayerAvatar login={entry.login} avatarUrl={entry.avatarUrl} size="md" />
      <Text color="white" fontWeight="medium">
        {entry.login}
      </Text>
    </HStack>

    <HStack gap={2}>
      <Text color="whiteAlpha.800">Очки за игру:</Text>
      <Text color={ACCENT} fontWeight="bold" fontSize="2xl">
        {formatScore(entry.score)}
      </Text>
    </HStack>
  </Flex>
)
