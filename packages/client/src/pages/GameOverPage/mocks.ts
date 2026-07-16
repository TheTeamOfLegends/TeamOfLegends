import { LeaderboardEntry } from '../../components/Leaderboard'

export const MOCK_SESSION_SCORE = 1500

export const MOCK_GAME_OVER_ENTRIES: LeaderboardEntry[] = [
  { place: 1, login: 'ace_pilot', score: 2_000_000 },
  { place: 2, login: 'nova_x', score: 200 },
  { place: 3, login: 'orbit_kid', score: 75 },
  { place: 4, login: 'you', score: 1_500, isCurrentUser: true },
  { place: 5, login: 'comet_run', score: 1_234 },
  { place: 6, login: 'pulsar', score: 999 },
  { place: 7, login: 'nebula', score: 850 },
  { place: 8, login: 'warp', score: 640 },
]
