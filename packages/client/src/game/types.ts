export type GameOverPayload = {
  score: number
  highScore: number
  isNewHighScore: boolean
}

export type GameHudState = {
  score: number
  hp: number
  maxHp: number
  machineGunRemainingMs: number
  shotgunRemainingMs: number
}

export type StartGameOptions = {
  onGameOver?: (payload: GameOverPayload) => void
  onHudUpdate?: (hud: GameHudState) => void
  onPauseChange?: (paused: boolean) => void
}

export type GameController = {
  stop: () => void
  restart: () => void
  resume: () => void
  pause: () => void
  /** When false, ESC/P do not toggle pause (e.g. start overlay). */
  setPauseControlsEnabled: (enabled: boolean) => void
}

export type Vec2 = { x: number; y: number }

export type Player = {
  x: number
  y: number
  radius: number
  color: string
  speed: number
  velocityY: number
  velocityX: number
  isJumping: boolean
  isDJumping: boolean
  maxHp: number
  currentHp: number
}

export type Enemy = {
  x: number
  y: number
  radius: number
  color: string
  speed: number
  lifetime: number
  rotation: number
  rotation_direction: number
}

export type Bullet = {
  x: number
  y: number
  velocityX: number
  velocityY: number
  radius: number
  color: string
  lifetime: number | null
}

export type BonusType = 'health' | 'machineGun' | 'shotgun'

export type Bonus = {
  x: number
  y: number
  radius: number
  type: BonusType
  color: string
  speed: number
  nextSparkle: number
}

export type Particle = {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  life: number
  color: string
  type: 'spark' | 'circle' | string
}

export type Platform = {
  x: number
  y: number
  width: number
  height: number
  color: string
  direction: number
  design: string
  gradient: CanvasGradient
  speedX?: number
  speedY?: number
  maxX?: number
  minX?: number
  maxY?: number
  minY?: number
}

export type Trampoline = {
  x: number
  y: number
  width: number
  height: number
  isActive: boolean
  activationTime: number
}

export type Star = {
  x: number
  y: number
  radius: number
  brightness: number
  twinkleSpeed: number
  spiralAngle: number
  spiralRadius: number
}
