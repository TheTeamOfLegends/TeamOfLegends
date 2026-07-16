export type LeaderboardEntry = {
  place: number
  login: string
  score: number
  avatarUrl?: string
  isCurrentUser?: boolean
}

export type LeaderboardAction = {
  to: string
  label: string
}
