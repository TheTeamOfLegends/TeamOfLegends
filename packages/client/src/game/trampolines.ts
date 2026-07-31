import { TRAMPOLINE } from './constants'
import { createParticle } from './particles'
import type { Particle, Player, Trampoline } from './types'

export const generateTrampolines = (
  width: number,
  height: number
): Trampoline[] => {
  const startX = width / (TRAMPOLINE.count + 1)
  return Array.from({ length: TRAMPOLINE.count }, (_, i) => ({
    x: startX * (i + 1) - TRAMPOLINE.width / 2,
    y: height - 30,
    width: TRAMPOLINE.width,
    height: TRAMPOLINE.height,
    isActive: false,
    activationTime: 0,
  }))
}

export const drawTrampolines = (
  ctx: CanvasRenderingContext2D,
  trampolineList: Trampoline[]
): void => {
  trampolineList.forEach(trampoline => {
    ctx.fillStyle = '#666'
    ctx.fillRect(
      trampoline.x + 10,
      trampoline.y + TRAMPOLINE.height,
      TRAMPOLINE.width - 20,
      10
    )

    ctx.fillStyle = trampoline.isActive
      ? TRAMPOLINE.activeColor
      : TRAMPOLINE.color
    ctx.beginPath()
    ctx.moveTo(trampoline.x, trampoline.y)
    ctx.lineTo(trampoline.x + TRAMPOLINE.width, trampoline.y)
    ctx.lineTo(
      trampoline.x + TRAMPOLINE.width - 5,
      trampoline.y + TRAMPOLINE.height
    )
    ctx.lineTo(trampoline.x + 5, trampoline.y + TRAMPOLINE.height)
    ctx.fill()
  })
}

export const checkTrampolineCollisions = (
  player: Player,
  trampolineList: Trampoline[],
  particles: Particle[],
  onBounce: () => void
): void => {
  trampolineList.forEach(trampoline => {
    if (
      player.x + player.radius > trampoline.x &&
      player.x - player.radius < trampoline.x + trampoline.width &&
      player.y + player.radius > trampoline.y &&
      player.y - player.radius < trampoline.y + TRAMPOLINE.height &&
      player.velocityY > 0
    ) {
      player.velocityY = TRAMPOLINE.bounceForce
      player.isJumping = true
      player.isDJumping = false
      trampoline.isActive = true
      trampoline.activationTime = Date.now()
      onBounce()

      for (let i = 0; i < 8; i++) {
        particles.push(
          createParticle(
            player.x,
            trampoline.y,
            TRAMPOLINE.activeColor,
            'spark'
          )
        )
      }
    }

    if (trampoline.isActive && Date.now() - trampoline.activationTime > 200) {
      trampoline.isActive = false
    }
  })
}
