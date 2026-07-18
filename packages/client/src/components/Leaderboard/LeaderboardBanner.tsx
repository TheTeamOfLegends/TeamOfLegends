import { Flex, HStack, Text } from '@chakra-ui/react'
import { LeaderboardEntry } from './types'
import { formatScore } from './utils'
import { ACCENT, bannerStyles } from './LeaderboardBanner.styles'
import { PlayerAvatar } from './PlayerAvatar'

type Props = {
  entry: LeaderboardEntry
  sessionScore: number
  label?: string
}

export const LeaderboardBanner = ({
  entry,
  sessionScore,
  label = 'Очки за игру:',
}: Props) => (
  <Flex {...bannerStyles}>
    <HStack gap={3}>
      <PlayerAvatar login={entry.login} avatarUrl={entry.avatarUrl} size="md" />
      <Text color="white" fontWeight="medium">
        {entry.login}
      </Text>
    </HStack>

    <HStack gap={2}>
      <Text color="whiteAlpha.800">{label}</Text>
      <Text color={ACCENT} fontWeight="bold" fontSize="2xl">
        {formatScore(sessionScore)}
      </Text>
    </HStack>
  </Flex>
)
