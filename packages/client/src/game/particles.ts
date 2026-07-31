import type { Particle } from './types'

export const createParticle = (
  x: number,
  y: number,
  color: string,
  type: string
): Particle => ({
  x,
  y,
  size: Math.random() * 3 + 2,
  speedX: (Math.random() - 0.5) * 8,
  speedY: (Math.random() - 0.5) * 8,
  life: 1,
  color,
  type,
})

export const updateParticles = (particles: Particle[]): void => {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]
    p.x += p.speedX
    p.y += p.speedY
    p.life -= 0.02
    if (p.life <= 0) particles.splice(i, 1)
  }
}

export const drawParticles = (
  ctx: CanvasRenderingContext2D,
  particles: Particle[]
): void => {
  particles.forEach(p => {
    ctx.globalAlpha = p.life
    ctx.beginPath()
    if (p.type === 'spark') {
      ctx.moveTo(p.x - p.size, p.y - p.size)
      ctx.lineTo(p.x + p.size, p.y + p.size)
      ctx.moveTo(p.x + p.size, p.y - p.size)
      ctx.lineTo(p.x - p.size, p.y + p.size)
      ctx.strokeStyle = p.color
      ctx.stroke()
    } else {
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = p.color
      ctx.fill()
    }
    ctx.globalAlpha = 1
  })
}
