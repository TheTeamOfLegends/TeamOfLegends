export const ROUND_MARK_START = 'sa-round-start'
export const ROUND_MARK_END = 'sa-round-end'
export const ROUND_MEASURE = 'sa-round'

const FPS_WINDOW_MS = 500

export type RoundStats = {
  durationMs: number
  avgFps: number
}

export type FpsSampler = {
  sample: (nowMs: number) => void
  getFps: () => number
  getAvgFps: () => number
  reset: () => void
}

let roundStartNow = 0

const now = (): number =>
  typeof performance !== 'undefined' && typeof performance.now === 'function'
    ? performance.now()
    : Date.now()

const hasMarkApi = (): boolean =>
  typeof performance !== 'undefined' &&
  typeof performance.mark === 'function' &&
  typeof performance.measure === 'function' &&
  typeof performance.getEntriesByName === 'function'

const clearOwnEntries = () => {
  if (!hasMarkApi()) return

  try {
    performance.clearMarks(ROUND_MARK_START)
    performance.clearMarks(ROUND_MARK_END)
    performance.clearMeasures(ROUND_MEASURE)
  } catch {
    // jsdom / старые браузеры могут не принимать имя
  }
}

export const markRoundStart = (): void => {
  roundStartNow = now()
  clearOwnEntries()

  if (!hasMarkApi()) return

  try {
    performance.mark(ROUND_MARK_START)
  } catch {
    // ignore
  }
}

export const getRoundDurationMs = (pausedMs = 0): number =>
  Math.max(0, now() - roundStartNow - pausedMs)

export const markRoundEnd = (pausedMs = 0, avgFps = 0): RoundStats => {
  if (hasMarkApi()) {
    try {
      performance.mark(ROUND_MARK_END)
      performance.measure(ROUND_MEASURE, ROUND_MARK_START, ROUND_MARK_END)
      const entries = performance.getEntriesByName(ROUND_MEASURE, 'measure')
      const last = entries[entries.length - 1]
      const wallClockMs = last?.duration ?? now() - roundStartNow

      return {
        durationMs: Math.max(0, wallClockMs - pausedMs),
        avgFps,
      }
    } catch {
      // fallback ниже
    }
  }

  return {
    durationMs: getRoundDurationMs(pausedMs),
    avgFps,
  }
}

export const createFpsSampler = (): FpsSampler => {
  let frames = 0
  let windowStart = now()
  let lastSample = windowStart
  let fps = 0
  let totalFrames = 0
  let totalElapsed = 0

  return {
    sample(nowMs: number) {
      frames += 1
      lastSample = nowMs
      const elapsed = nowMs - windowStart
      if (elapsed >= FPS_WINDOW_MS) {
        fps = Math.round((frames * 1000) / elapsed)
        totalFrames += frames
        totalElapsed += elapsed
        frames = 0
        windowStart = nowMs
      }
    },
    getFps: () => {
      const elapsed = lastSample - windowStart
      if (frames > 0 && elapsed >= 100) {
        return Math.round((frames * 1000) / elapsed)
      }
      return fps
    },
    getAvgFps: () => {
      const elapsed = totalElapsed + Math.max(0, lastSample - windowStart)
      const counted = totalFrames + frames
      if (elapsed <= 0 || counted <= 0) {
        return fps
      }
      return Math.round((counted * 1000) / elapsed)
    },
    reset: () => {
      frames = 0
      windowStart = now()
      lastSample = windowStart
      fps = 0
      totalFrames = 0
      totalElapsed = 0
    },
  }
}

/** `m:ss` / `mm:ss`, с `withTenths` — `m:ss.t` */
export const formatDuration = (ms: number, withTenths = false): string => {
  const clamped = Math.max(0, Number.isFinite(ms) ? ms : 0)

  if (withTenths) {
    const totalTenths = Math.floor(clamped / 100)
    const minutes = Math.floor(totalTenths / 600)
    const seconds = Math.floor((totalTenths % 600) / 10)
    const tenths = totalTenths % 10
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${tenths}`
  }

  const totalSec = Math.floor(clamped / 1000)
  const minutes = Math.floor(totalSec / 60)
  const seconds = totalSec % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
