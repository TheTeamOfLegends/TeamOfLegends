import { gameAssets } from './gameAssets'
import { ENEMY_INDICATOR } from './constants'
import { getIndicatorPosition } from './combat'
import type { Bonus, Bullet, Enemy, Player } from './types'

export const drawPlayer = (
  ctx: CanvasRenderingContext2D,
  player: Player,
  mouseX: number
): void => {
  if (!gameAssets.player) {
    return
  }

  const height = player.radius * 5
  const width = height * (gameAssets.player.width / gameAssets.player.height)

  const direction = mouseX < player.x ? -1 : 1

  ctx.save()

  ctx.translate(player.x, player.y)

  ctx.scale(direction, 1)

  ctx.drawImage(gameAssets.player, -width / 2, -height / 2, width, height)

  ctx.restore()
}

export const drawPlayerGun = (
  ctx: CanvasRenderingContext2D,
  player: Player,
  mouseX: number,
  mouseY: number
): void => {
  if (!gameAssets.gun) return

  const dx = mouseX - player.x
  const dy = mouseY - player.y
  const angle = Math.atan2(dy, dx)

  const gunHeight = player.radius * 4
  const gunWidth = gunHeight * (gameAssets.gun.width / gameAssets.gun.height)

  ctx.save()

  ctx.translate(player.x, player.y)

  ctx.translate(player.radius * 0.3, 0)

  ctx.rotate(angle + Math.PI / 2)

  ctx.drawImage(gameAssets.gun, -gunWidth / 2, -gunHeight, gunWidth, gunHeight)

  ctx.restore()
}

export const drawMouseLine = (
  ctx: CanvasRenderingContext2D,
  player: Player,
  mouseX: number,
  mouseY: number
): void => {
  const dx = mouseX - player.x
  const dy = mouseY - player.y
  const distance = Math.hypot(dx, dy)

  if (distance === 0) {
    return
  }

  const maxLength = 150
  const length = Math.min(distance, maxLength)

  const endX = player.x + (dx / distance) * length
  const endY = player.y + (dy / distance) * length

  ctx.save()

  ctx.beginPath()
  ctx.moveTo(player.x, player.y)
  ctx.lineTo(endX, endY)

  ctx.setLineDash([6, 8])
  ctx.lineWidth = 2
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
  ctx.stroke()

  ctx.restore()
}

export const drawEnemies = (
  ctx: CanvasRenderingContext2D,
  enemies: Enemy[]
): void => {
  if (!gameAssets.enemy) {
    return
  }

  enemies.forEach((enemy, index) => {
    const size = enemy.radius * 3
    const wobble = Math.sin(performance.now() * 0.008 + index) * 0.04

    ctx.save()
    ctx.translate(enemy.x, enemy.y)
    ctx.rotate(enemy.rotation + wobble + Math.PI / 2)
    ctx.drawImage(gameAssets.enemy, -size / 2, -size / 2, size, size)
    ctx.restore()
  })
}

export const drawEnemyIndicators = (
  ctx: CanvasRenderingContext2D,
  enemies: Enemy[],
  width: number,
  height: number
): void => {
  enemies.forEach(enemy => {
    const indicator = getIndicatorPosition(enemy, width, height)

    if (indicator.onBorder) {
      ctx.save()
      ctx.globalAlpha = ENEMY_INDICATOR.opacity

      const dx = enemy.x - width / 2
      const dy = enemy.y - height / 2
      const angle = Math.atan2(dy, dx)

      ctx.translate(indicator.x, indicator.y)
      ctx.rotate(angle)

      ctx.fillStyle = ENEMY_INDICATOR.color
      ctx.beginPath()
      ctx.moveTo(ENEMY_INDICATOR.size, 0)
      ctx.lineTo(-ENEMY_INDICATOR.size / 2, -ENEMY_INDICATOR.size / 2)
      ctx.lineTo(-ENEMY_INDICATOR.size / 2, ENEMY_INDICATOR.size / 2)
      ctx.closePath()
      ctx.fill()

      ctx.strokeStyle = '#b9e9f8dc'
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.restore()
    }
  })
}

export const drawBullets = (
  ctx: CanvasRenderingContext2D,
  bullets: Bullet[]
): void => {
  bullets.forEach(bullet => {
    const alpha =
      bullet.lifetime != null ? Math.min(bullet.lifetime / 10, 1) : 1

    const glow = ctx.createRadialGradient(
      bullet.x,
      bullet.y,
      0,
      bullet.x,
      bullet.y,
      bullet.radius * 4
    )

    glow.addColorStop(0, `rgba(255,255,220,${alpha})`)
    glow.addColorStop(0.4, `rgba(255,220,80,${alpha * 0.8})`)
    glow.addColorStop(1, 'rgba(255,220,0,0)')

    ctx.beginPath()
    ctx.arc(bullet.x, bullet.y, bullet.radius * 2, 0, Math.PI * 2)
    ctx.fillStyle = glow
    ctx.fill()

    ctx.beginPath()
    ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2)
    ctx.fillStyle = '#fff7c0'
    ctx.fill()

    ctx.beginPath()
    ctx.arc(bullet.x, bullet.y, bullet.radius * 0.35, 0, Math.PI * 2)
    ctx.fillStyle = '#ffffff'
    ctx.fill()
  })
}

export const drawBonuses = (
  ctx: CanvasRenderingContext2D,
  bonuses: Bonus[]
): void => {
  const now = performance.now()

  bonuses.forEach((bonus, index) => {
    const pulse = 1 + Math.sin(now * 0.005 + index) * 0.08

    const image =
      bonus.type === 'health'
        ? gameAssets.health
        : bonus.type === 'machineGun'
        ? gameAssets.machineGun
        : gameAssets.shotgun

    if (!image) {
      return
    }

    const glowColor =
      bonus.type === 'health'
        ? 'rgba(0,255,120,0.35)'
        : bonus.type === 'machineGun'
        ? 'rgba(255,220,0,0.35)'
        : 'rgba(140,100,255,0.35)'

    const gradient = ctx.createRadialGradient(
      bonus.x,
      bonus.y,
      bonus.radius * 0.3,
      bonus.x,
      bonus.y,
      bonus.radius * 2
    )

    gradient.addColorStop(0, glowColor)
    gradient.addColorStop(1, 'rgba(0,0,0,0)')

    ctx.beginPath()
    ctx.arc(bonus.x, bonus.y, bonus.radius * 2, 0, Math.PI * 2)
    ctx.fillStyle = gradient
    ctx.fill()

    ctx.save()
    ctx.translate(bonus.x, bonus.y)
    ctx.translate(0, Math.sin(now * 0.003 + index) * 2)

    if (bonus.type === 'machineGun') {
      ctx.rotate(now * 0.001)
    }

    const sizeMultiplier = bonus.type === 'health' ? 2.0 : 2.4
    const maxSize = bonus.radius * sizeMultiplier * pulse
    const aspect = image.width / image.height || 1

    let width: number
    let height: number

    if (aspect >= 1) {
      width = maxSize
      height = maxSize / aspect
    } else {
      height = maxSize
      width = maxSize * aspect
    }

    ctx.drawImage(image, -width / 2, -height / 2, width, height)
    ctx.restore()
  })
}
