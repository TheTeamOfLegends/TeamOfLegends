const HIGH_SCORE_KEY = 'highScore'

export const getHighScore = (): number => {
  if (typeof window === 'undefined') {
    return 0
  }

  return parseInt(localStorage.getItem(HIGH_SCORE_KEY) || '0', 10) || 0
}

/** Сохраняет рекорд, если новый score больше текущего. Возвращает актуальный best. */
export const saveHighScore = (score: number): number => {
  if (typeof window === 'undefined') {
    return score
  }

  const current = getHighScore()
  if (score > current) {
    localStorage.setItem(HIGH_SCORE_KEY, String(score))
    return score
  }

  return current
}
