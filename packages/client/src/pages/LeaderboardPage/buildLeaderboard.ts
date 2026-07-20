import { LeaderboardEntry } from '../../components/Leaderboard/types'

type CurrentUserScore = {
  login: string
  score: number
  avatarUrl?: string
}

/** Подмешивает лучший результат текущего игрока в таблицу и пересчитывает места. */
export const buildLeaderboardWithUserScore = (
  entries: LeaderboardEntry[],
  currentUser: CurrentUserScore
): LeaderboardEntry[] => {
  const others = entries
    .filter(entry => !entry.isCurrentUser)
    .map(({ place, login, score, avatarUrl }) => ({
      place,
      login,
      score,
      avatarUrl,
    }))

  const merged: Omit<LeaderboardEntry, 'place'>[] = [
    ...others,
    {
      login: currentUser.login,
      score: currentUser.score,
      avatarUrl: currentUser.avatarUrl,
      isCurrentUser: true,
    },
  ]

  return merged
    .sort((a, b) => b.score - a.score)
    .map((entry, index) => ({
      ...entry,
      place: index + 1,
    }))
}
