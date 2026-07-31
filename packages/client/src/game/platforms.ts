import { PLATFORM_STYLES } from './constants'
import type { Platform, Player } from './types'

export const generatePlatforms = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): Platform[] => {
  const platforms: Platform[] = []
  const sections = { horizontal: 3, vertical: 4 }
  const sectionWidth = width / sections.horizontal
  const sectionHeight = height / sections.vertical

  for (let i = 0; i < sections.vertical; i++) {
    for (let j = 0; j < sections.horizontal; j++) {
      const platformCount = Math.floor(Math.random() * 2) + 2
      let lastY = (i + 1) * sectionHeight - sectionHeight / 2

      for (let k = 0; k < platformCount; k++) {
        const platformWidth = Math.random() * 60 + 100

        let x: number
        if (k === 0) {
          x = j * sectionWidth + (sectionWidth - platformWidth) / 2
        } else {
          const prevPlatform = platforms[platforms.length - 1]
          const minX = Math.max(
            j * sectionWidth,
            prevPlatform.x - PLATFORM_STYLES.maxJumpDistance
          )
          const maxX = Math.min(
            (j + 1) * sectionWidth - platformWidth,
            prevPlatform.x + PLATFORM_STYLES.maxJumpDistance
          )
          x = minX + Math.random() * (maxX - minX)
        }

        const y = lastY - (Math.random() * 30 + 40)
        lastY = y

        const shouldMove = Math.random() < 0.5
        const design =
          PLATFORM_STYLES.designs[
            Math.floor(Math.random() * PLATFORM_STYLES.designs.length)
          ]

        const platform: Platform = {
          x,
          y,
          width: platformWidth,
          height: 20,
          color:
            design === 'metal'
              ? '#708090'
              : design === 'ancient'
              ? '#8B4513'
              : '#4A5F34',
          direction: 1,
          design,
          gradient: ctx.createLinearGradient(x, y, x, y),
        }

        if (design === 'metal') {
          platform.gradient.addColorStop(0, 'rgba(0, 212, 255, 0.7)')
          platform.gradient.addColorStop(1, 'rgba(0, 150, 255, 0.5)')
        } else if (design === 'ancient') {
          platform.gradient.addColorStop(0, 'rgba(255, 0, 128, 0.7)')
          platform.gradient.addColorStop(1, 'rgba(255, 0, 80, 0.5)')
        } else {
          platform.gradient.addColorStop(0, 'rgba(0, 255, 136, 0.7)')
          platform.gradient.addColorStop(1, 'rgba(0, 200, 100, 0.5)')
        }

        if (shouldMove) {
          if (Math.random() < 0.6) {
            platform.speedX = Math.random() * 2 + 1
            platform.maxX = x + Math.min(sectionWidth / 2, 150)
            platform.minX = x - Math.min(sectionWidth / 2, 150)
          } else {
            platform.speedY = Math.random() * 1.5 + 0.5
            platform.maxY = y + 50
            platform.minY = y - 50
          }
        }

        platforms.push(platform)
      }
    }
  }

  for (let i = 0; i < 3; i++) {
    const platformWidth = Math.random() * 60 + 120
    const x = Math.random() * (width - platformWidth)
    const y = Math.random() * (height - 200) + 100

    const grad = ctx.createLinearGradient(x, y, x, y)
    grad.addColorStop(0, 'rgba(0, 212, 255, 0.7)')
    grad.addColorStop(1, 'rgba(0, 150, 255, 0.5)')

    platforms.push({
      x,
      y,
      width: platformWidth,
      height: 20,
      color: '#708090',
      direction: 1,
      design: 'metal',
      speedX: Math.random() * 2 + 1,
      maxX: x + 200,
      minX: x - 200,
      gradient: grad,
    })
  }

  return platforms
}

export const updatePlatforms = (platforms: Platform[]): void => {
  platforms.forEach(platform => {
    if (platform.speedX) {
      platform.x += platform.speedX * platform.direction
      if (platform.maxX !== undefined && platform.minX !== undefined) {
        if (platform.x > platform.maxX || platform.x < platform.minX) {
          platform.direction *= -1
        }
      } else if (
        platform.maxX !== undefined &&
        (platform.x > platform.maxX || platform.x < platform.maxX - 200)
      ) {
        platform.direction *= -1
      }
    }
    if (platform.speedY) {
      platform.y += platform.speedY * platform.direction
      if (
        platform.maxY !== undefined &&
        platform.minY !== undefined &&
        (platform.y > platform.maxY || platform.y < platform.minY)
      ) {
        platform.direction *= -1
      }
    }
  })
}

export const drawPlatforms = (
  ctx: CanvasRenderingContext2D,
  platforms: Platform[]
): void => {
  platforms.forEach(platform => {
    ctx.fillStyle = platform.gradient
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height)

    const glowGradient = ctx.createRadialGradient(
      platform.x + platform.width / 2,
      platform.y + platform.height / 2,
      0,
      platform.x + platform.width / 2,
      platform.y + platform.height / 2,
      platform.width / 2 + 10
    )

    const glowColor =
      platform.design === 'metal'
        ? 'rgba(0, 212, 255, 0.2)'
        : platform.design === 'ancient'
        ? 'rgba(255, 0, 128, 0.2)'
        : 'rgba(0, 255, 136, 0.2)'

    glowGradient.addColorStop(0, glowColor)
    glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

    ctx.fillStyle = glowGradient
    ctx.fillRect(
      platform.x - platform.width / 2 - 10,
      platform.y,
      platform.width * 2,
      platform.height
    )

    const outlineColor =
      platform.design === 'metal'
        ? 'rgba(0, 212, 255, 0.8)'
        : platform.design === 'ancient'
        ? 'rgba(255, 0, 128, 0.8)'
        : 'rgba(0, 255, 136, 0.8)'

    ctx.strokeStyle = outlineColor
    ctx.lineWidth = 1
    ctx.strokeRect(platform.x, platform.y, platform.width, platform.height)
    ctx.globalAlpha = 1
  })
}

export const checkPlatformCollisions = (
  player: Player,
  platforms: Platform[],
  isDropping: boolean
): boolean => {
  let onPlatform = false
  if (isDropping) return onPlatform

  platforms.forEach(platform => {
    if (
      player.x + player.radius > platform.x &&
      player.x - player.radius < platform.x + platform.width
    ) {
      if (
        player.y + player.radius > platform.y &&
        player.y + player.radius < platform.y + platform.height &&
        player.velocityY > 0
      ) {
        player.y = platform.y - player.radius
        player.velocityY = 0
        player.isJumping = false
        player.isDJumping = false
        onPlatform = true

        if (platform.speedX) {
          player.x += platform.speedX * platform.direction
        }
      }
    }
  })

  return onPlatform
}
