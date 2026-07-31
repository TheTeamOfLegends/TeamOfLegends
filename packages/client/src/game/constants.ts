export const COLORS = {
  hp: '#8eff56ff',
  ammo: '#fcff4fff',
  shotgun: '#5900ffff',
  accent: '#EB4B76',
  accentSoft: 'rgba(235, 75, 118, 0.35)',
} as const

export const PHYSICS = {
  gravity: 0.5,
  friction: 0.8,
  minJumpVelocity: -6,
  maxJumpVelocity: -14,
} as const

export const COMBAT = {
  bulletSpeed: 15,
  bulletRadius: 3,
  shootCooldown: 250,
  machineGunCooldown: 100,
  machineGunDuration: 10_000,
  shotgunDuration: 15_000,
  enemySpawnInterval: 2000,
  enemySpawnSafeRadius: 500,
  bonusSpawnInterval: 5000,
  bonusRadius: 15,
} as const

export const TRAMPOLINE = {
  count: 3,
  width: 80,
  height: 10,
  bounceForce: -20,
  color: '#FF4081',
  activeColor: '#FF80AB',
} as const

export const PLATFORM_STYLES = {
  maxJumpDistance: 150,
  designs: ['metal'] as string[],
}

export const ENEMY_INDICATOR = {
  size: 15,
  color: '#ff6666',
  borderOffset: 20,
  opacity: 0.8,
}

export const TARGET_FPS = 60
export const MS_PER_FRAME = 1000 / TARGET_FPS
