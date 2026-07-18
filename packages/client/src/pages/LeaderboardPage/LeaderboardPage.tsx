import { Helmet } from 'react-helmet-async'
import { Box, Flex } from '@chakra-ui/react'
import { Header } from '../../components/Header/Header'
import {
  LeaderboardPanel,
  LeaderboardTable,
} from '../../components/Leaderboard'
import { MOCK_LEADERBOARD } from './mocks'
import { pageShellStyles, pageContentStyles } from './styles'

export const LeaderboardPage = () => (
  <>
    <Helmet>
      <meta charSet="utf-8" />
      <title>Лидерборд — Space Assault</title>
      <meta name="description" content="Таблица лидеров Space Assault" />
    </Helmet>

    <Box {...pageShellStyles}>
      <Header />
      <Flex {...pageContentStyles}>
        <LeaderboardPanel>
          <LeaderboardTable entries={MOCK_LEADERBOARD} />
        </LeaderboardPanel>
      </Flex>
    </Box>
  </>
)
