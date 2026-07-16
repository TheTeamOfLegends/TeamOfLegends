import { LeaderboardEntry } from './types'

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { place: 1, login: 'ace_pilot', score: 2_000_000 },
  { place: 2, login: 'nova_x', score: 200 },
  { place: 3, login: 'orbit_kid', score: 75 },
  { place: 4, login: 'you', score: 2_000, isCurrentUser: true },
  { place: 5, login: 'comet_run', score: 1_234 },
  { place: 6, login: 'pulsar', score: 999 },
  { place: 7, login: 'nebula', score: 850 },
  { place: 8, login: 'warp', score: 640 },
]
