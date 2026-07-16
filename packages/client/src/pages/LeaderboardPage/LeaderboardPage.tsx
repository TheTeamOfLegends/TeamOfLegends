import { Helmet } from 'react-helmet'
import { Box, Flex } from '@chakra-ui/react'
import { Header } from '../../components/Header/Header'
import { LeaderboardPanel } from '../../components/Leaderboard'
import { MOCK_LEADERBOARD } from './mocks'
import { pageShellStyles, pageContentStyles } from './styles'

export const LeaderboardPage = () => {
  const currentUser = MOCK_LEADERBOARD.find(entry => entry.isCurrentUser)

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Лидерборд — Space Assault</title>
        <meta name="description" content="Таблица лидеров Space Assault" />
      </Helmet>

      <Box {...pageShellStyles}>
        <Header />
        <Flex {...pageContentStyles}>
          <LeaderboardPanel
            entries={MOCK_LEADERBOARD}
            currentUser={currentUser}
          />
        </Flex>
      </Box>
    </>
  )
}
