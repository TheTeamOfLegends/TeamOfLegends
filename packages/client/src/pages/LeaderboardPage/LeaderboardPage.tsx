import { useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { Box, Flex } from '@chakra-ui/react'
import { Header } from '../../components/Header/Header'
import {
  LeaderboardPanel,
  LeaderboardTable,
} from '../../components/Leaderboard'
import { API_BASE_URL } from '../../constants'
import { getHighScore } from '../../game/scoreStorage'
import { useProfileStore } from '../../stores/profileStore'
import { buildLeaderboardWithUserScore } from './buildLeaderboard'
import { MOCK_LEADERBOARD } from './mocks'
import { pageShellStyles, pageContentStyles } from './styles'

export const LeaderboardPage = () => {
  const user = useProfileStore(s => s.user)
  const loadProfile = useProfileStore(s => s.loadProfile)

  useEffect(() => {
    if (!user) {
      loadProfile().catch(() => {
        // Профиль может быть недоступен — покажем логин-заглушку
      })
    }
  }, [user, loadProfile])

  const entries = useMemo(
    () =>
      buildLeaderboardWithUserScore(MOCK_LEADERBOARD, {
        login: user?.login || user?.display_name || 'you',
        score: getHighScore(),
        avatarUrl: user?.avatar
          ? `${API_BASE_URL}/v2/resources${user.avatar}`
          : undefined,
      }),
    [user]
  )

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
          <LeaderboardPanel>
            <LeaderboardTable entries={entries} />
          </LeaderboardPanel>
        </Flex>
      </Box>
    </>
  )
}
