import { ENEMY_INDICATOR } from './constants'
import { getIndicatorPosition } from './combat'
import type { Bonus, Bullet, Enemy, Player } from './types'

export const drawPlayer = (
  ctx: CanvasRenderingContext2D,
  player: Player
): void => {
  ctx.save()
  ctx.translate(player.x, player.y)

  ctx.beginPath()
  ctx.arc(0, 0, player.radius + 5, 0, Math.PI * 2)
  ctx.strokeStyle = `rgba(100, 200, 255, ${
    (player.currentHp / player.maxHp) * 0.5
  })`
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(0, 0, player.radius * 0.9, 0, Math.PI * 2)
  ctx.fillStyle = '#6666ff'
  ctx.fill()

  ctx.restore()
}

export const drawGun = (
  ctx: CanvasRenderingContext2D,
  player: Player,
  mouseX: number,
  mouseY: number
): void => {
  const gunLength = 20
  const dx = mouseX - player.x
  const dy = mouseY - player.y
  const angle = Math.atan2(dy, dx)

  ctx.beginPath()
  ctx.moveTo(player.x, player.y)
  ctx.lineTo(
    player.x + Math.cos(angle) * gunLength,
    player.y + Math.sin(angle) * gunLength
  )
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 3
  ctx.stroke()
  ctx.closePath()
}

export const drawEnemies = (
  ctx: CanvasRenderingContext2D,
  enemies: Enemy[]
): void => {
  enemies.forEach(enemy => {
    ctx.save()
    ctx.translate(enemy.x, enemy.y)
    ctx.rotate(enemy.rotation)

    ctx.beginPath()
    const spikes = 8
    for (let i = 0; i <= spikes * 2 + 1; i++) {
      const radius = i % 2 === 0 ? enemy.radius : enemy.radius * 0.6
      const angle = (i / spikes) * Math.PI
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.fillStyle = '#edd7ffff'
    ctx.fill()
    ctx.strokeStyle = '#b98cbbff'
    ctx.stroke()

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
    ctx.beginPath()
    ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2)
    if (bullet.lifetime != null) {
      const intensity = 255 * Math.min(bullet.lifetime / 10, 1)
      ctx.fillStyle = `rgb(${intensity},${intensity}, 0)`
    } else {
      ctx.fillStyle = 'yellow'
    }
    ctx.fill()
    ctx.closePath()
  })
}

export const drawBonuses = (
  ctx: CanvasRenderingContext2D,
  bonuses: Bonus[]
): void => {
  const now = Date.now()
  bonuses.forEach(bonus => {
    const gradient = ctx.createRadialGradient(
      bonus.x,
      bonus.y,
      bonus.radius * 0.5,
      bonus.x,
      bonus.y,
      bonus.radius * 2
    )
    if (bonus.type !== 'shotgun') {
      gradient.addColorStop(
        0,
        bonus.type === 'health'
          ? 'rgba(0, 255, 0, 0.3)'
          : 'rgba(255, 255, 0, 0.3)'
      )
    } else {
      gradient.addColorStop(0, 'rgba(135, 80, 255, 0.3)')
    }
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

    ctx.beginPath()
    ctx.arc(bonus.x, bonus.y, bonus.radius * 2, 0, Math.PI * 2)
    ctx.fillStyle = gradient
    ctx.fill()

    const pulse = Math.sin(now * 0.01) * 0.2 + 0.8
    ctx.beginPath()
    ctx.arc(bonus.x, bonus.y, bonus.radius * pulse, 0, Math.PI * 2)
    ctx.fillStyle = bonus.color
    ctx.fill()

    ctx.fillStyle = 'black'
    ctx.font = 'bold 12px Arial'
    ctx.textAlign = 'left'
  })
}
