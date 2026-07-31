import { Helmet } from 'react-helmet-async'
import { Box, Flex } from '@chakra-ui/react'
import { useLocation } from 'react-router-dom'
import { Header } from '../../components/Header/Header'
import {
  LeaderboardPanel,
  LeaderboardBanner,
  LeaderboardTable,
  LeaderboardActions,
} from '../../components/Leaderboard'
import { MOCK_GAME_OVER_ENTRIES, MOCK_SESSION_SCORE } from './mocks'
import { pageShellStyles, pageContentStyles } from './styles'

type GameOverLocationState = {
  score?: number
}

export const GameOverPage = () => {
  const location = useLocation()
  const state = (location.state ?? {}) as GameOverLocationState

  const sessionScore = state.score ?? MOCK_SESSION_SCORE
  const currentUser = MOCK_GAME_OVER_ENTRIES.find(entry => entry.isCurrentUser)

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Игра окончена — Space Assault</title>
        <meta
          name="description"
          content="Результат игры и таблица лидеров Space Assault"
        />
      </Helmet>

      <Box {...pageShellStyles}>
        <Header />
        <Flex {...pageContentStyles}>
          <LeaderboardPanel>
            {currentUser && (
              <LeaderboardBanner
                entry={currentUser}
                sessionScore={sessionScore}
              />
            )}
            <LeaderboardTable entries={MOCK_GAME_OVER_ENTRIES} />
            <LeaderboardActions
              primary={{ to: '/game', label: 'Попробовать ещё раз' }}
              secondary={{ to: '/', label: 'Отмена' }}
            />
          </LeaderboardPanel>
        </Flex>
      </Box>
    </>
  )
}
