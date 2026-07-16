import { Box, Heading } from '@chakra-ui/react'
import { LeaderboardEntry } from '../../pages/LeaderboardPage/types'
import { panelStyles, titleStyles } from './LeaderboardPanel.styles'
import { LeaderboardBanner } from '../Leaderboard/LeaderboardBanner'
import { LeaderboardTable } from '../Leaderboard/LeaderboardTable'
import { LeaderboardActions } from '../Leaderboard/LeaderboardActions'

type Props = {
  entries: LeaderboardEntry[]
  currentUser?: LeaderboardEntry
}

export const LeaderboardPanel = ({ entries, currentUser }: Props) => (
  <Box {...panelStyles}>
    <Heading {...titleStyles}>rating</Heading>
    {currentUser && <LeaderboardBanner entry={currentUser} />}
    <LeaderboardTable entries={entries} />
    <LeaderboardActions />
  </Box>
)
