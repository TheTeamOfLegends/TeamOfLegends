import { Box, Flex, VStack } from '@chakra-ui/react'
import { LeaderboardEntry } from '../../pages/LeaderboardPage/types'
import {
  tableWrapperStyles,
  tableScrollStyles,
  tableHeaderStyles,
  placeColStyles,
} from './LeaderboardTable.styles'
import { LeaderboardRow } from '../Leaderboard/LeaderboardRow'

type Props = {
  entries: LeaderboardEntry[]
}

export const LeaderboardTable = ({ entries }: Props) => (
  <Box {...tableWrapperStyles}>
    <Box {...tableScrollStyles}>
      <Flex {...tableHeaderStyles}>
        <Box {...placeColStyles} py={3}>
          №
        </Box>
        <Box flex={1} px={4} py={3}>
          Игрок
        </Box>
        <Box flex={1} px={4} py={3}>
          Очки
        </Box>
      </Flex>

      <VStack gap={0} align="stretch">
        {entries.map(entry => (
          <LeaderboardRow key={entry.place} entry={entry} />
        ))}
      </VStack>
    </Box>
  </Box>
)
