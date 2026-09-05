import type { Star } from './types'
import type { Theme } from '../theme/ThemeContext'

export type StarryNight = {
  stars: Star[]
  time: number
  waveAmplitude: number
  waveFrequency: number
}

export const createStarryNight = (): StarryNight => ({
  stars: [],
  time: 0,
  waveAmplitude: 30,
  waveFrequency: 0.02,
})

export const initializeStars = (
  starryNight: StarryNight,
  width: number,
  height: number
): void => {
  starryNight.stars = []
  for (let i = 0; i < 150; i++) {
    starryNight.stars.push({
      x: Math.random() * width,
      y: Math.random() * height * 0.8,
      radius: Math.random() * 1.5 + 0.5,
      brightness: Math.random() * 0.5 + 0.5,
      twinkleSpeed: Math.random() * 0.03 + 0.01,
      spiralAngle: Math.random() * Math.PI * 2,
      spiralRadius: Math.random() * 20 + 5,
    })
  }
}

export const drawBackground = (
  ctx: CanvasRenderingContext2D,
  starryNight: StarryNight,
  width: number,
  height: number,
  theme: Theme
): void => {
  starryNight.time += 0.01

  const gradient = ctx.createLinearGradient(0, 0, 0, height)
  if (theme === 'light') {
    gradient.addColorStop(0, '#90a4ea')
    gradient.addColorStop(0.3, '#3a79d1')
    gradient.addColorStop(0.6, '#3065aa')
    gradient.addColorStop(1, '#34528e')
  } else {
    gradient.addColorStop(0, '#0a1a4d')
    gradient.addColorStop(0.3, '#1a2d5e')
    gradient.addColorStop(0.6, '#2d3e6f')
    gradient.addColorStop(1, '#1a3a52')
  }

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  if (theme === 'dark') {
    ctx.fillStyle = 'rgba(10, 30, 60, 0.6)'
  } else {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
  }
  ctx.beginPath()
  ctx.moveTo(0, height)
  for (let x = 0; x <= width; x += 20) {
    const wave1 =
      Math.sin(x * 0.01 + starryNight.time * 0.5) * starryNight.waveAmplitude
    const wave2 =
      Math.sin(x * 0.005 + starryNight.time * 0.3) *
      starryNight.waveAmplitude *
      0.5
    const y = height * 0.7 + wave1 + wave2
    ctx.lineTo(x, y)
  }
  ctx.lineTo(width, height)
  ctx.closePath()
  ctx.fill()

  starryNight.stars.forEach(star => {
    const twinkle = Math.sin(starryNight.time * star.twinkleSpeed) * 0.5 + 0.5
    const brightness = star.brightness * (twinkle * 0.5 + 0.5)

    const spiralX =
      star.x +
      Math.cos(starryNight.time * 0.02 + star.spiralAngle) * star.spiralRadius
    const spiralY =
      star.y +
      Math.sin(starryNight.time * 0.02 + star.spiralAngle) *
        star.spiralRadius *
        0.5

    ctx.fillStyle = `rgba(255, 255, 200, ${brightness})`
    ctx.beginPath()
    ctx.arc(spiralX, spiralY, star.radius, 0, Math.PI * 2)
    ctx.fill()

    const glowGradient = ctx.createRadialGradient(
      spiralX,
      spiralY,
      0,
      spiralX,
      spiralY,
      star.radius * 3
    )
    glowGradient.addColorStop(0, `rgba(255, 255, 200, ${brightness * 0.4})`)
    glowGradient.addColorStop(1, 'rgba(255, 255, 200, 0)')
    ctx.fillStyle = glowGradient
    ctx.fillRect(
      spiralX - star.radius * 3,
      spiralY - star.radius * 3,
      star.radius * 6,
      star.radius * 6
    )
  })

  ctx.strokeStyle = 'rgba(150, 180, 255, 0.1)'
  ctx.lineWidth = 2

  for (let y = 0; y < height; y += 80) {
    ctx.beginPath()
    for (let x = 0; x <= width; x += 20) {
      const wave = Math.sin(x * 0.01 + starryNight.time * 0.05 + y * 0.005) * 15
      const posY = y + wave
      if (x === 0) ctx.moveTo(x, posY)
      else ctx.lineTo(x, posY)
    }
    ctx.stroke()
  }
}
