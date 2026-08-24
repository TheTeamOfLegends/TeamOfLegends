import {
  getLeaderboard,
  GetLeaderboardResponse,
  LEADERBOARD_LIMIT,
  SCORE_KEY,
} from '@/api/leaderboardApi'
import { toaster } from '@/components/ui/toaster'
import { ERROR_MESSAGES } from '@/dictionary'
import { Box, Button, Flex } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Header } from '../../components/Header/Header'
import {
  LeaderboardEntry,
  LeaderboardPanel,
  LeaderboardTable,
} from '../../components/Leaderboard'
import { useProfileStore } from '../../stores/profileStore'
import { pageContentStyles, pageShellStyles } from './styles'
import { delay } from '@/components/Leaderboard/utils'

const REQUEST_DELAY_MS = 200
const INITIAL_CURSOR = 0
const INITIAL_LEADERBOARD: GetLeaderboardResponse = []

export const LeaderboardPage = () => {
  const user = useProfileStore(s => s.user)

  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [cursor, setCursor] = useState(INITIAL_CURSOR)
  const [lastPageLength, setLastPageLength] = useState(0)
  const [leaderboard, setLeaderboard] =
    useState<GetLeaderboardResponse>(INITIAL_LEADERBOARD)

  useEffect(() => {
    const loadLeaderboard = async () => {
      setIsLoading(true)

      await delay(REQUEST_DELAY_MS)

      try {
        const response = await getLeaderboard({ cursor: INITIAL_CURSOR })
        setLeaderboard(response)
        setLastPageLength(response.length)
      } catch (error) {
        toaster.create({
          description:
            error instanceof Error
              ? error.message
              : ERROR_MESSAGES.REQUEST_FAILED,
          type: 'error',
        })
      } finally {
        setIsLoading(false)
      }

      return INITIAL_LEADERBOARD
    }

    loadLeaderboard()
  }, [])

  const entries: LeaderboardEntry[] = leaderboard.map(({ data }, index) => ({
    login: data.login,
    avatarUrl: data.avatar,
    isCurrentUser: data.login === user?.login,
    place: index + 1,
    score: data[SCORE_KEY],
  }))

  const isLastPage = lastPageLength < LEADERBOARD_LIMIT

  const fetchLeaderboard = async () => {
    const nextCursor = cursor + LEADERBOARD_LIMIT
    setIsFetching(true)

    await delay(REQUEST_DELAY_MS)

    try {
      const nextLeaderboard = await getLeaderboard({ cursor: nextCursor })
      setLeaderboard(prevLeaderboard => [
        ...prevLeaderboard,
        ...nextLeaderboard,
      ])
      setCursor(nextCursor)
    } catch (error) {
      toaster.create({
        description:
          error instanceof Error
            ? error.message
            : ERROR_MESSAGES.REQUEST_FAILED,
        type: 'error',
      })
    } finally {
      setIsFetching(false)
    }

    return INITIAL_LEADERBOARD
  }

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
            <LeaderboardTable entries={entries} isLoading={isLoading} />

            {!isLastPage && (
              <Button
                loading={isFetching}
                colorPalette="blue"
                onClick={fetchLeaderboard}>
                Ещё
              </Button>
            )}
          </LeaderboardPanel>
        </Flex>
      </Box>
    </>
  )
}
