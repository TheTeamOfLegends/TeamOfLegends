import { Box, Flex, Spinner, VStack } from '@chakra-ui/react'
import { LeaderboardRow } from './LeaderboardRow'
import {
  placeColStyles,
  tableHeaderStyles,
  tableScrollStyles,
  tableWrapperStyles,
} from './LeaderboardTable.styles'
import { LeaderboardEntry } from './types'

type Props = {
  entries: LeaderboardEntry[]
  isLoading: boolean
}

export const LeaderboardTable = ({ entries, isLoading }: Props) => (
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

      {isLoading && (
        <Box display="flex" justifyContent="center" flex={1} px={4} py={3}>
          <Spinner color="blue.solid" size="lg" />
        </Box>
      )}
    </Box>
  </Box>
)
