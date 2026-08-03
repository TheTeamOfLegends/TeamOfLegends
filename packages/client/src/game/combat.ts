import { COLORS, COMBAT, ENEMY_INDICATOR } from './constants'
import { createParticle } from './particles'
import type { Bonus, Bullet, Enemy, Particle, Player } from './types'

export type DifficultyState = {
  startTime: number
  enemySpeedMultiplier: number
  enemySpawnRateMultiplier: number
  maxEnemySpeed: number
  minSpawnInterval: number
  difficultyScale: {
    initial: number
    max: number
    timeToMax: number
    curve: number
  }
}

export const createDifficulty = (): DifficultyState => ({
  startTime: Date.now(),
  enemySpeedMultiplier: 1,
  enemySpawnRateMultiplier: 1,
  maxEnemySpeed: 2.5,
  minSpawnInterval: 10,
  difficultyScale: {
    initial: 1,
    max: 2.5,
    timeToMax: 180,
    curve: 3,
  },
})

export const updateDifficulty = (
  difficulty: DifficultyState,
  now = Date.now()
): void => {
  const timePlayed = (now - difficulty.startTime) / 1000
  const normalizedTime = Math.min(
    timePlayed / difficulty.difficultyScale.timeToMax,
    1
  )

  const difficultyMultiplier =
    1 +
    Math.pow(normalizedTime, 1 / difficulty.difficultyScale.curve) *
      (difficulty.difficultyScale.max - difficulty.difficultyScale.initial)

  difficulty.enemySpeedMultiplier = Math.min(
    difficulty.maxEnemySpeed,
    difficultyMultiplier
  )

  difficulty.enemySpawnRateMultiplier = Math.max(0.1, 1 - normalizedTime * 0.9)
}

export const spawnEnemy = (
  enemies: Enemy[],
  player: Player,
  width: number,
  height: number,
  difficulty: DifficultyState
): void => {
  const side = Math.floor(Math.random() * 4)
  let x = 0
  let y = 0
  let validSpawn = false
  let attempts = 0
  const maxAttempts = 5

  while (!validSpawn && attempts < maxAttempts) {
    switch (side) {
      case 0:
        x = Math.random() * width
        y = -20
        break
      case 1:
        x = width + 20
        y = Math.random() * height
        break
      case 2:
        x = Math.random() * width
        y = height + 20
        break
      default:
        x = -20
        y = Math.random() * height
        break
    }

    const dx = x - player.x
    const dy = y - player.y
    const distanceFromPlayer = Math.sqrt(dx * dx + dy * dy)

    if (distanceFromPlayer >= COMBAT.enemySpawnSafeRadius) {
      validSpawn = true
    } else {
      attempts++
    }
  }

  if (enemies.length < 30 && validSpawn) {
    enemies.push({
      x,
      y,
      radius: 10,
      color: 'red',
      speed: 2 * difficulty.enemySpeedMultiplier,
      lifetime: 0,
      rotation: 0,
      rotation_direction: Math.random() > 0.5 ? 1 : -1,
    })
  }
}

export const spawnBonus = (
  bonuses: Bonus[],
  width: number,
  height: number
): void => {
  const side = Math.floor(Math.random() * 4)
  let x = 0
  let y = 0

  switch (side) {
    case 0:
      x = Math.random() * width
      y = -20
      break
    case 1:
      x = width + 20
      y = Math.random() * height
      break
    case 2:
      x = Math.random() * width
      y = height + 20
      break
    default:
      x = -20
      y = Math.random() * height
      break
  }

  const isHealthBonus = Math.random() < 0.5
  if (!isHealthBonus && Math.random() < 0.1) {
    bonuses.push({
      x,
      y,
      radius: COMBAT.bonusRadius,
      type: 'shotgun',
      color: COLORS.shotgun,
      speed: 2,
      nextSparkle: Date.now(),
    })
  } else {
    bonuses.push({
      x,
      y,
      radius: COMBAT.bonusRadius,
      type: isHealthBonus ? 'health' : 'machineGun',
      color: isHealthBonus ? COLORS.hp : COLORS.ammo,
      speed: 2,
      nextSparkle: Date.now(),
    })
  }
}

export type ShootContext = {
  player: Player
  mouseX: number
  mouseY: number
  bullets: Bullet[]
  particles: Particle[]
  lastShootTime: number
  machineGunEndTime: number
  now: number
  onShoot: () => void
}

export const shoot = (ctx: ShootContext): number => {
  const { now } = ctx
  const currentCooldown =
    now < ctx.machineGunEndTime
      ? COMBAT.machineGunCooldown
      : COMBAT.shootCooldown
  if (now - ctx.lastShootTime < currentCooldown) return ctx.lastShootTime

  const dx = ctx.mouseX - ctx.player.x
  const dy = ctx.mouseY - ctx.player.y
  const angle = Math.atan2(dy, dx)

  ctx.bullets.push({
    x: ctx.player.x,
    y: ctx.player.y,
    velocityX: Math.cos(angle) * COMBAT.bulletSpeed,
    velocityY: Math.sin(angle) * COMBAT.bulletSpeed,
    radius: COMBAT.bulletRadius,
    color: 'yellow',
    lifetime: null,
  })

  const gunLength = 20
  for (let i = 0; i < 5; i++) {
    ctx.particles.push(
      createParticle(
        ctx.player.x + Math.cos(angle) * gunLength,
        ctx.player.y + Math.sin(angle) * gunLength,
        COLORS.ammo,
        'spark'
      )
    )
  }

  ctx.onShoot()
  return now
}

export const bigShoot = (ctx: ShootContext): number => {
  const { now } = ctx
  const currentCooldown =
    now < ctx.machineGunEndTime
      ? COMBAT.machineGunCooldown
      : COMBAT.shootCooldown
  if (now - ctx.lastShootTime < currentCooldown) return ctx.lastShootTime

  const dx = ctx.mouseX - ctx.player.x
  const dy = ctx.mouseY - ctx.player.y
  const angle = Math.atan2(dy, dx)

  const offsets = [
    [0, 0],
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ] as const

  offsets.forEach(([ox, oy]) => {
    ctx.bullets.push({
      x: ctx.player.x,
      y: ctx.player.y,
      velocityX: Math.cos(angle) * COMBAT.bulletSpeed + ox,
      velocityY: Math.sin(angle) * COMBAT.bulletSpeed + oy,
      radius: COMBAT.bulletRadius,
      color: 'yellow',
      lifetime: 20,
    })
  })

  const gunLength = 20
  for (let i = 0; i < 5; i++) {
    ctx.particles.push(
      createParticle(
        ctx.player.x + Math.cos(angle) * gunLength,
        ctx.player.y + Math.sin(angle) * gunLength,
        COLORS.ammo,
        'spark'
      )
    )
  }

  ctx.onShoot()
  return now
}

export type UpdateEnemiesResult = {
  gameOver: boolean
}

export const updateEnemies = (
  enemies: Enemy[],
  player: Player,
  onHit: () => void,
  onDeath: () => void
): UpdateEnemiesResult => {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i]
    enemy.lifetime += 1
    const dx = player.x - enemy.x
    const dy = player.y - enemy.y
    const distance = Math.sqrt(dx * dx + dy * dy) || 1

    const speedFactor = Math.max(Math.min(enemy.lifetime / 1000, 2), 0.5)
    enemy.x += (dx / distance) * enemy.speed * speedFactor
    enemy.y += (dy / distance) * enemy.speed * speedFactor
    enemy.radius = 10 + 10 * Math.min(enemy.lifetime / 1000, 0.5)

    const targetRotation = Math.atan2(dy, dx)

    enemy.rotation += (targetRotation - enemy.rotation) * 0.08

    if (distance < player.radius + enemy.radius) {
      player.currentHp -= 10
      enemies.splice(i, 1)
      onHit()

      if (player.currentHp <= 0) {
        onDeath()
        return { gameOver: true }
      }
    }
  }

  return { gameOver: false }
}

export const updateBullets = (
  bullets: Bullet[],
  enemies: Enemy[],
  bonuses: Bonus[],
  particles: Particle[],
  width: number,
  height: number,
  onEnemyKill: () => void,
  onBonusDestroy: () => void
): number => {
  let scoreDelta = 0

  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i]
    bullet.x += bullet.velocityX
    bullet.y += bullet.velocityY

    particles.push(createParticle(bullet.x, bullet.y, '#ffd84d', 'spark'))

    if (bullet.x < 0 || bullet.x > width || bullet.y < 0 || bullet.y > height) {
      bullets.splice(i, 1)
      continue
    }

    if (bullet.lifetime !== null && bullet.lifetime > 0) {
      bullet.lifetime -= 1
    }
    if (bullet.lifetime === 0) {
      bullets.splice(i, 1)
      continue
    }

    let hit = false
    for (let j = enemies.length - 1; j >= 0; j--) {
      const enemy = enemies[j]
      const dx = bullet.x - enemy.x
      const dy = bullet.y - enemy.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < enemy.radius + bullet.radius) {
        for (let k = 0; k < 10; k++) {
          particles.push(
            createParticle(enemy.x, enemy.y, '#ffffff83', 'circle')
          )
        }
        onEnemyKill()
        enemies.splice(j, 1)
        bullets.splice(i, 1)
        scoreDelta += 1
        hit = true
        break
      }
    }
    if (hit) continue

    for (let j = bonuses.length - 1; j >= 0; j--) {
      const bonus = bonuses[j]
      const dx = bullet.x - bonus.x
      const dy = bullet.y - bonus.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < bonus.radius + bullet.radius) {
        onBonusDestroy()
        for (let k = 0; k < 20; k++) {
          particles.push(
            createParticle(
              bonus.x,
              bonus.y,
              bonus.type === 'health'
                ? COLORS.hp
                : bonus.type === 'shotgun'
                ? COLORS.shotgun
                : COLORS.ammo,
              Math.random() < 0.3 ? 'spark' : 'circle'
            )
          )
        }
        bonuses.splice(j, 1)
        bullets.splice(i, 1)
        break
      }
    }
  }

  return scoreDelta
}

export type PowerUps = {
  machineGunEndTime: number
  shotgunEndTime: number
}

export const updateBonuses = (
  bonuses: Bonus[],
  player: Player,
  particles: Particle[],
  powerUps: PowerUps,
  onPickup: (type: string) => void,
  now = Date.now()
): void => {
  for (let i = bonuses.length - 1; i >= 0; i--) {
    const bonus = bonuses[i]
    const dx = player.x - bonus.x
    const dy = player.y - bonus.y
    const distance = Math.sqrt(dx * dx + dy * dy) || 1

    bonus.x += (dx / distance) * bonus.speed
    bonus.y += (dy / distance) * bonus.speed

    if (now > bonus.nextSparkle) {
      particles.push(
        createParticle(
          bonus.x + (Math.random() - 0.5) * bonus.radius,
          bonus.y + (Math.random() - 0.5) * bonus.radius,
          bonus.type === 'health'
            ? '#50ff50'
            : bonus.type === 'shotgun'
            ? '#8550ffff'
            : '#ffff50',
          'spark'
        )
      )
      bonus.nextSparkle = now + 50
    }

    if (distance < player.radius + bonus.radius) {
      for (let j = 0; j < 15; j++) {
        particles.push(
          createParticle(
            bonus.x,
            bonus.y,
            bonus.type === 'health'
              ? '#00ff50'
              : bonus.type === 'shotgun'
              ? '#8550ffff'
              : '#ffff50',
            Math.random() < 0.5 ? 'spark' : 'circle'
          )
        )
      }

      onPickup(bonus.type)

      if (bonus.type === 'machineGun') {
        powerUps.machineGunEndTime = now + COMBAT.machineGunDuration
      } else if (bonus.type === 'health') {
        player.currentHp += 10
      } else {
        powerUps.shotgunEndTime = now + COMBAT.shotgunDuration
      }
      bonuses.splice(i, 1)
    }
  }
}

export const getIndicatorPosition = (
  enemy: Enemy,
  width: number,
  height: number
): { x: number; y: number; onBorder: boolean } => {
  const margin = ENEMY_INDICATOR.borderOffset
  let x = enemy.x
  let y = enemy.y
  let onBorder = false

  if (enemy.x < 0 || enemy.x > width || enemy.y < 0 || enemy.y > height) {
    const dx = enemy.x - width / 2
    const dy = enemy.y - height / 2
    const angle = Math.atan2(dy, dx)

    const maxDistance = Math.max(width, height)
    let testX = width / 2 + Math.cos(angle) * maxDistance
    let testY = height / 2 + Math.sin(angle) * maxDistance

    if (testX < margin) {
      const ratio = (margin - width / 2) / (testX - width / 2)
      testX = margin
      testY = height / 2 + (testY - height / 2) * ratio
    } else if (testX > width - margin) {
      const ratio = (width - margin - width / 2) / (testX - width / 2)
      testX = width - margin
      testY = height / 2 + (testY - height / 2) * ratio
    }

    if (testY < margin) {
      const ratio = (margin - height / 2) / (testY - height / 2)
      testY = margin
      testX = width / 2 + (testX - width / 2) * ratio
    } else if (testY > height - margin) {
      const ratio = (height - margin - height / 2) / (testY - height / 2)
      testY = height - margin
      testX = width / 2 + (testX - width / 2) * ratio
    }

    x = testX
    y = testY
    onBorder = true
  }

  return { x, y, onBorder }
}
