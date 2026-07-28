/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { getHighScore, saveHighScore } from './scoreStorage'

export type GameOverPayload = {
  score: number
  highScore: number
  isNewHighScore: boolean
}

export type StartGameOptions = {
  onGameOver?: (payload: GameOverPayload) => void
}

export type GameController = {
  stop: () => void
  restart: () => void
}

export function startGame(
  canvas: HTMLCanvasElement,
  options: StartGameOptions = {}
): GameController {
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return {
      stop: () => undefined,
      restart: () => undefined,
    }
  }

  let destroyed = false
  let rafId = 0
  let isNewHighScore = false

  const preventContextMenu = event => event.preventDefault()
  document.addEventListener('contextmenu', preventContextMenu)

  canvas.width = Math.min(window.innerWidth, 1920)
  canvas.height = Math.min(window.innerHeight - 80, 1080)
  if (canvas.height < 400) {
    canvas.height = Math.min(window.innerHeight, 1080)
  }
  canvas.style.cursor = 'crosshair'

  const getMousePos = event => {
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    }
  }

  const circle = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 12,
    color: 'blue',
    speed: 7.5,
    velocityY: 0,
    velocityX: 0,
    isJumping: false,
    isDJumping: false,
  }

  // Color
  const hp_color = '#8eff56ff'
  const ammo_color = '#fcff4fff'
  const shotgun_color = '#5900ffff'

  // Physics constants
  const gravity = 0.5
  const friction = 0.8
  const groundY = canvas.height - circle.radius

  const physics = {
    minJumpVelocity: -6, // minimum jump velocity when button is quickly released
    maxJumpVelocity: -14, // maximum jump velocity when button is held
    jumpGravity: 0.5, // normal gravity
    fallGravity: 0.8, // faster gravity when falling
  }

  const player = {
    ...circle,
    maxHp: 100,
    currentHp: 100,
  }

  // Track key states
  const keys = {
    ArrowLeft: false,
    ArrowRight: false,
    A: false,
    D: false,
    S: false,
  }

  let enemies = []
  const enemySpawnInterval = 2000 // spawn every 2 seconds
  const enemySpawnSafeRadius = 500 // minimum distance from player to spawn enemies
  let bullets = []
  const bulletSpeed = 15
  const bulletRadius = 3
  const shootCooldown = 250 // milliseconds between shots
  let lastShootTime = 0
  let mouseX = 0
  let mouseY = 0
  let score = 0
  let gameOver = false

  const particles = []

  // Van Gogh Starry Night background
  const starryNight = {
    stars: [],
    time: 0,
    waveAmplitude: 30,
    waveFrequency: 0.02,
  }

  function initializeStars() {
    starryNight.stars = []
    for (let i = 0; i < 150; i++) {
      starryNight.stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.8,
        radius: Math.random() * 1.5 + 0.5,
        brightness: Math.random() * 0.5 + 0.5,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        spiralAngle: Math.random() * Math.PI * 2,
        spiralRadius: Math.random() * 20 + 5,
      })
    }
  }

  function createParticle(x, y, color, type) {
    return {
      x,
      y,
      size: Math.random() * 3 + 2,
      speedX: (Math.random() - 0.5) * 8,
      speedY: (Math.random() - 0.5) * 8,
      life: 1,
      color: color,
      type: type,
    }
  }

  function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]
      p.x += p.speedX
      p.y += p.speedY
      p.life -= 0.02
      if (p.life <= 0) particles.splice(i, 1)
    }
  }

  function drawParticles() {
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

  function drawBackground() {
    starryNight.time += 0.01

    // Gradient sky from deep blue at top to lighter blue
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, '#0a1a4d')
    gradient.addColorStop(0.3, '#1a2d5e')
    gradient.addColorStop(0.6, '#2d3e6f')
    gradient.addColorStop(1, '#1a3a52')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw wavy hills/mountains in Van Gogh style
    ctx.fillStyle = 'rgba(10, 30, 60, 0.6)'
    ctx.beginPath()
    ctx.moveTo(0, canvas.height)
    for (let x = 0; x <= canvas.width; x += 20) {
      const wave1 =
        Math.sin(x * 0.01 + starryNight.time * 0.5) * starryNight.waveAmplitude
      const wave2 =
        Math.sin(x * 0.005 + starryNight.time * 0.3) *
        starryNight.waveAmplitude *
        0.5
      const y = canvas.height * 0.7 + wave1 + wave2
      ctx.lineTo(x, y)
    }
    ctx.lineTo(canvas.width, canvas.height)
    ctx.closePath()
    ctx.fill()

    // Draw stars with twinkling effect
    starryNight.stars.forEach(star => {
      // Calculate twinkling brightness
      const twinkle = Math.sin(starryNight.time * star.twinkleSpeed) * 0.5 + 0.5
      const brightness = star.brightness * (twinkle * 0.5 + 0.5)

      // Calculate spiral movement (Van Gogh swirl effect)
      const spiralX =
        star.x +
        Math.cos(starryNight.time * 0.02 + star.spiralAngle) * star.spiralRadius
      const spiralY =
        star.y +
        Math.sin(starryNight.time * 0.02 + star.spiralAngle) *
          star.spiralRadius *
          0.5

      // Draw star as glowing point
      ctx.fillStyle = `rgba(255, 255, 200, ${brightness})`
      ctx.beginPath()
      ctx.arc(spiralX, spiralY, star.radius, 0, Math.PI * 2)
      ctx.fill()

      // Draw glow around star
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

    // Draw additional swirling wind patterns
    ctx.strokeStyle = 'rgba(150, 180, 255, 0.1)'
    ctx.lineWidth = 2

    for (let y = 0; y < canvas.height; y += 80) {
      ctx.beginPath()
      for (let x = 0; x <= canvas.width; x += 20) {
        const wave =
          Math.sin(x * 0.01 + starryNight.time * 0.05 + y * 0.005) * 15
        const posY = y + wave
        if (x === 0) ctx.moveTo(x, posY)
        else ctx.lineTo(x, posY)
      }
      ctx.stroke()
    }
  }

  const platforms = []

  const bonuses = []
  const bonusSpawnInterval = 5000 // spawn every 5 seconds
  const bonusRadius = 15
  const machineGunDuration = 10000 // 30 seconds
  const shotgunDuration = 15000 // 30 seconds
  const machineGunCooldown = 100 // faster shooting
  let machineGunEndTime = 0
  let shotgunEndTime = 0

  const platformStyles = {
    maxJumpDistance: 150, // maximum horizontal distance player can jump
    minPlatformSpacing: 60, // minimum vertical space between platforms
    designs: ['metal'], //, 'normal', 'ancient']
  }

  const difficulty = {
    startTime: Date.now(),
    enemySpeedMultiplier: 1,
    enemySpawnRateMultiplier: 1,
    maxEnemySpeed: 2.5,
    minSpawnInterval: 10,
    difficultyScale: {
      initial: 1,
      max: 2.5,
      timeToMax: 180, // 5 minutes to reach max difficulty
      curve: 3, // Higher values make difficulty increase slower over time
    },
  }

  // Add after other constants
  const trampolines = {
    count: 3,
    width: 80,
    height: 10,
    spacing: 200,
    bounceForce: -20, // Stronger than normal jump
    color: '#FF4081',
    activeColor: '#FF80AB',
  }

  let highScore = getHighScore()

  // Add indicator constants
  const enemyIndicator = {
    size: 15,
    color: '#ff6666',
    borderOffset: 20,
    opacity: 0.8,
  }

  function spawnEnemy() {
    const side = Math.floor(Math.random() * 4) // 0: top, 1: right, 2: bottom, 3: left
    let x, y
    let validSpawn = false
    let attempts = 0
    const maxAttempts = 5

    while (!validSpawn && attempts < maxAttempts) {
      switch (side) {
        case 0: // top
          x = Math.random() * canvas.width
          y = -20
          break
        case 1: // right
          x = canvas.width + 20
          y = Math.random() * canvas.height
          break
        case 2: // bottom
          x = Math.random() * canvas.width
          y = canvas.height + 20
          break
        case 3: // left
          x = -20
          y = Math.random() * canvas.height
          break
      }

      // Check if spawn position is far enough from player
      const dx = x - player.x
      const dy = y - player.y
      const distanceFromPlayer = Math.sqrt(dx * dx + dy * dy)

      if (distanceFromPlayer >= enemySpawnSafeRadius) {
        validSpawn = true
      } else {
        attempts++
      }
    }

    const speedMultiplier = difficulty.enemySpeedMultiplier
    if (enemies.length < 30 && validSpawn)
      enemies.push({
        x,
        y,
        radius: 10,
        color: 'red',
        speed: 2 * speedMultiplier,
        lifetime: 0,
        rotation: 0, //Math.PI * 2,
        rotation_direction: Math.random() > 0.5 ? 1 : -1,
      })
  }

  function shoot() {
    //enemies.pop();
    const now = Date.now()
    const currentCooldown =
      now < machineGunEndTime ? machineGunCooldown : shootCooldown
    if (now - lastShootTime < currentCooldown) return

    const dx = mouseX - player.x
    const dy = mouseY - player.y
    const angle = Math.atan2(dy, dx)

    bullets.push({
      x: player.x,
      y: player.y,
      velocityX: Math.cos(angle) * bulletSpeed,
      velocityY: Math.sin(angle) * bulletSpeed,
      radius: bulletRadius,
      color: 'yellow',
      lifetime: null,
    })

    // Add muzzle flash particles
    const gunLength = 20
    for (let i = 0; i < 5; i++) {
      particles.push(
        createParticle(
          player.x + Math.cos(angle) * gunLength,
          player.y + Math.sin(angle) * gunLength,
          ammo_color,
          'spark'
        )
      )
    }

    createShootSound()
    lastShootTime = now
  }

  function bigshoot() {
    const now = Date.now()
    const currentCooldown =
      now < machineGunEndTime ? machineGunCooldown : shootCooldown
    if (now - lastShootTime < currentCooldown) return

    const dx = mouseX - player.x
    const dy = mouseY - player.y
    const angle = Math.atan2(dy, dx)

    bullets.push({
      x: player.x,
      y: player.y,
      velocityX: Math.cos(angle) * bulletSpeed,
      velocityY: Math.sin(angle) * bulletSpeed,
      radius: bulletRadius,
      color: 'yellow',
      lifetime: 20,
    })
    bullets.push({
      x: player.x,
      y: player.y,
      velocityX: Math.cos(angle) * bulletSpeed + 1,
      velocityY: Math.sin(angle) * bulletSpeed,
      radius: bulletRadius,
      color: 'yellow',
      lifetime: 20,
    })
    bullets.push({
      x: player.x,
      y: player.y,
      velocityX: Math.cos(angle) * bulletSpeed,
      velocityY: Math.sin(angle) * bulletSpeed + 1,
      radius: bulletRadius,
      color: 'yellow',
      lifetime: 20,
    })
    bullets.push({
      x: player.x,
      y: player.y,
      velocityX: Math.cos(angle) * bulletSpeed - 1,
      velocityY: Math.sin(angle) * bulletSpeed,
      radius: bulletRadius,
      color: 'yellow',
      lifetime: 20,
    })
    bullets.push({
      x: player.x,
      y: player.y,
      velocityX: Math.cos(angle) * bulletSpeed,
      velocityY: Math.sin(angle) * bulletSpeed - 1,
      radius: bulletRadius,
      color: 'yellow',
      lifetime: 20,
    })

    // Add muzzle flash particles
    const gunLength = 20
    for (let i = 0; i < 5; i++) {
      particles.push(
        createParticle(
          player.x + Math.cos(angle) * gunLength,
          player.y + Math.sin(angle) * gunLength,
          ammo_color,
          'spark'
        )
      )
    }

    createShootSound()
    lastShootTime = now
  }

  function updateEnemies() {
    for (let i = enemies.length - 1; i >= 0; i--) {
      const enemy = enemies[i]
      enemy.lifetime += 1
      const dx = player.x - enemy.x
      const dy = player.y - enemy.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      enemy.x +=
        (dx / distance) *
        enemy.speed *
        Math.max(Math.min(enemy.lifetime / 1000, 2), 0.5)
      enemy.y +=
        (dy / distance) *
        enemy.speed *
        Math.max(Math.min(enemy.lifetime / 1000, 2), 0.5)
      enemy.radius = 10 + 10 * Math.min(enemy.lifetime / 1000, 0.5)

      // Update rotation based on speed
      // Rotation speed scales with enemy velocity
      const rotationSpeed =
        enemy.speed * 0.02 * Math.max(Math.min(enemy.lifetime / 1000, 2), 0.5) // Adjust multiplier for faster/slower rotation
      enemy.rotation +=
        enemy.rotation_direction > 0 ? rotationSpeed : -rotationSpeed

      if (distance < player.radius + enemy.radius) {
        player.currentHp -= 10
        enemies.splice(i, 1)
        createDamageSound()

        if (player.currentHp <= 0) {
          gameOver = true
          isNewHighScore = score > highScore
          highScore = saveHighScore(score)
          options.onGameOver?.({
            score,
            highScore,
            isNewHighScore,
          })
          break
        }
      }
    }
  }

  function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
      const bullet = bullets[i]
      bullet.x += bullet.velocityX
      bullet.y += bullet.velocityY

      // Remove bullets that are off screen
      if (
        bullet.x < 0 ||
        bullet.x > canvas.width ||
        bullet.y < 0 ||
        bullet.y > canvas.height
      ) {
        bullets.splice(i, 1)
        continue
      }

      // Remove bullets lifetime
      if (bullet.lifetime > 0) {
        bullet.lifetime -= 1
      }
      if (bullet.lifetime == 0) {
        bullets.splice(i, 1)
        continue
      }

      // Check collision with enemies
      for (let j = enemies.length - 1; j >= 0; j--) {
        const enemy = enemies[j]
        const dx = bullet.x - enemy.x
        const dy = bullet.y - enemy.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < enemy.radius + bullet.radius) {
          // Explosion particles
          for (let k = 0; k < 10; k++) {
            particles.push(
              createParticle(enemy.x, enemy.y, '#ffffff83', 'circle')
            )
          }
          createEnemyDeathSound()
          enemies.splice(j, 1)
          bullets.splice(i, 1)
          score++
          break
        }
      }

      // Check collision with bonuses
      for (let j = bonuses.length - 1; j >= 0; j--) {
        const bonus = bonuses[j]
        const dx = bullet.x - bonus.x
        const dy = bullet.y - bonus.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < bonus.radius + bullet.radius) {
          createFailureSound() // Add this line before particles creation
          // Create destruction effect
          for (let k = 0; k < 20; k++) {
            particles.push(
              createParticle(
                bonus.x,
                bonus.y,
                bonus.type === 'health'
                  ? hp_color
                  : bonus.type === 'shotgun'
                  ? shotgun_color
                  : ammo_color,
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
  }

  function generatePlatforms() {
    platforms.length = 0

    const sections = {
      horizontal: 3,
      vertical: 4,
    }

    const sectionWidth = canvas.width / sections.horizontal
    const sectionHeight = canvas.height / sections.vertical

    // Generate platforms for each section
    for (let i = 0; i < sections.vertical; i++) {
      for (let j = 0; j < sections.horizontal; j++) {
        const platformCount = Math.floor(Math.random() * 2) + 2 // 2-3 platforms per section
        let lastY = (i + 1) * sectionHeight - sectionHeight / 2

        for (let k = 0; k < platformCount; k++) {
          const width = Math.random() * 60 + 100

          // Ensure platforms are within jumping range
          let x
          if (k === 0) {
            // First platform in section - position near center
            x = j * sectionWidth + (sectionWidth - width) / 2
          } else {
            // Position relative to previous platform
            const prevPlatform = platforms[platforms.length - 1]
            const minX = Math.max(
              j * sectionWidth,
              prevPlatform.x - platformStyles.maxJumpDistance
            )
            const maxX = Math.min(
              (j + 1) * sectionWidth - width,
              prevPlatform.x + platformStyles.maxJumpDistance
            )
            x = minX + Math.random() * (maxX - minX)
          }

          // Calculate y position with good vertical spacing
          const y = lastY - (Math.random() * 30 + 40)
          lastY = y

          const shouldMove = Math.random() < 0.5
          const design =
            platformStyles.designs[
              Math.floor(Math.random() * platformStyles.designs.length)
            ]

          const platform = {
            x,
            y,
            width,
            height: 20,
            color:
              design === 'metal'
                ? '#708090'
                : design === 'ancient'
                ? '#8B4513'
                : '#4A5F34',
            direction: 1,
            design,
            gradient: ctx.createLinearGradient(x, y, x, y), // + 20)
          }

          // Minimalist cosmic gradient based on design
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
              // Horizontal movement
              platform.speedX = Math.random() * 2 + 1
              platform.maxX = x + Math.min(sectionWidth / 2, 150)
              platform.minX = x - Math.min(sectionWidth / 2, 150)
            } else {
              // Vertical movement
              platform.speedY = Math.random() * 1.5 + 0.5
              platform.maxY = y + 50
              platform.minY = y - 50
            }
          }

          platforms.push(platform)
        }
      }
    }

    // Add connecting platforms between sections
    for (let i = 0; i < 3; i++) {
      const width = Math.random() * 60 + 120
      const x = Math.random() * (canvas.width - width)
      const y = Math.random() * (canvas.height - 200) + 100

      const grad = ctx.createLinearGradient(x, y, x, y) //+ 20);
      grad.addColorStop(0, 'rgba(0, 212, 255, 0.7)')
      grad.addColorStop(1, 'rgba(0, 150, 255, 0.5)')

      platforms.push({
        x,
        y,
        width,
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
  }

  // Update updatePlatforms function to handle min/max X positions
  function updatePlatforms() {
    platforms.forEach(platform => {
      if (platform.speedX) {
        platform.x += platform.speedX * platform.direction
        if (platform.maxX !== undefined && platform.minX !== undefined) {
          if (platform.x > platform.maxX || platform.x < platform.minX) {
            platform.direction *= -1
          }
        } else if (
          platform.x > platform.maxX ||
          platform.x < platform.maxX - 200
        ) {
          platform.direction *= -1
        }
      }
      if (platform.speedY) {
        platform.y += platform.speedY * platform.direction
        if (platform.y > platform.maxY || platform.y < platform.minY) {
          platform.direction *= -1
        }
      }
    })
  }

  function resetGame() {
    // Update high score before reset
    highScore = saveHighScore(score)
    isNewHighScore = false
    score = 0
    player.currentHp = player.maxHp
    player.x = canvas.width / 2
    player.y = canvas.height / 2
    player.velocityX = 0
    player.velocityY = 0
    enemies = []
    bullets = []
    bonuses.length = 0
    machineGunEndTime = 0
    shotgunEndTime = 0
    gameOver = false
    difficulty.startTime = Date.now()
    difficulty.enemySpeedMultiplier = 1
    difficulty.enemySpawnRateMultiplier = 1
    gameTrampolines = generateTrampolines()
    generatePlatforms()
  }

  function drawUI() {
    ctx.fillStyle = 'white'
    ctx.font = '20px Arial'
    ctx.fillText(`Score: ${score}`, 20, 30)

    // Draw HP bar
    const baseWidth = 200
    const barHeight = 20
    const hpRatio = player.currentHp / player.maxHp

    // Background bar (red)
    ctx.fillStyle = 'red'
    ctx.fillRect(20, 40, baseWidth, barHeight)

    // Normal HP (green)
    if (hpRatio <= 1) {
      ctx.fillStyle = 'green'
      ctx.fillRect(20, 40, baseWidth * hpRatio, barHeight)
    } else {
      // Fill normal HP part
      ctx.fillStyle = 'green'
      ctx.fillRect(20, 40, baseWidth, barHeight)

      // Overflow HP (blue)
      ctx.fillStyle = '#00a0ff'
      ctx.fillRect(20 + baseWidth, 40, baseWidth * (hpRatio - 1), barHeight)
    }

    ctx.strokeStyle = 'black'
    ctx.strokeRect(20, 40, baseWidth * Math.max(1, hpRatio), barHeight)

    // Draw machine gun timer if active
    const now = Date.now()
    if (now < machineGunEndTime) {
      const remaining = (machineGunEndTime - now) / 1000 // convert to seconds
      ctx.fillStyle = 'yellow'
      ctx.fillRect(20, 70, 200, 10)
      ctx.fillStyle = 'orange'
      const width = (remaining / (machineGunDuration / 1000)) * 200
      ctx.fillRect(20, 70, width, 10)
      ctx.strokeStyle = 'black'
      ctx.strokeRect(20, 70, 200, 10)
      ctx.fillStyle = 'white'
      ctx.font = '12px Arial'
      ctx.fillText(`Machine Gun: ${remaining.toFixed(1)}s`, 20, 95)
    }

    if (now < shotgunEndTime) {
      const remaining = (shotgunEndTime - now) / 1000 // convert to seconds
      ctx.fillStyle = 'yellow'
      ctx.fillRect(20, 105, 200, 10)
      ctx.fillStyle = 'orange'
      const width = (remaining / (shotgunDuration / 1000)) * 200
      ctx.fillRect(20, 105, width, 10)
      ctx.strokeStyle = 'black'
      ctx.strokeRect(20, 105, 200, 10)
      ctx.fillStyle = 'white'
      ctx.font = '12px Arial'
      ctx.fillText(`Shotgun: ${remaining.toFixed(1)}s`, 20, 130)
    }
  }

  function drawPlayer() {
    // Art Deco geometric player - diamond/art deco shape
    ctx.save()
    ctx.translate(player.x, player.y)

    //ctx.beginPath();
    //ctx.moveTo(0, -player.radius);
    //ctx.lineTo(player.radius * 0.6, player.radius * 0.8);
    //ctx.lineTo(-player.radius * 0.6, player.radius * 0.8);
    //ctx.closePath();
    //ctx.fillStyle = '#4444ff';
    //ctx.fill();

    // Shield effect
    ctx.beginPath()
    ctx.arc(0, 0, player.radius + 5, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(100, 200, 255, ${
      (player.currentHp / player.maxHp) * 0.5
    })`
    ctx.lineWidth = 2
    ctx.stroke()

    // Inner detail
    ctx.beginPath()
    ctx.arc(0, 0, player.radius * 0.9, 0, Math.PI * 2)
    ctx.fillStyle = '#6666ff'
    //ctx.fillStyle = '#2b2bfcff';
    ctx.fill()

    ctx.restore()
  }

  function drawEnemies() {
    enemies.forEach(enemy => {
      ctx.save()
      ctx.translate(enemy.x, enemy.y)
      ctx.rotate(enemy.rotation)

      // Spiky enemy design with rotation
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

  function getIndicatorPosition(enemy) {
    const margin = enemyIndicator.borderOffset
    let x = enemy.x
    let y = enemy.y
    let onBorder = false

    // Check if enemy is outside canvas bounds
    if (
      enemy.x < 0 ||
      enemy.x > canvas.width ||
      enemy.y < 0 ||
      enemy.y > canvas.height
    ) {
      // Calculate angle to enemy
      const dx = enemy.x - canvas.width / 2
      const dy = enemy.y - canvas.height / 2
      const angle = Math.atan2(dy, dx)

      // Find intersection with canvas border
      const maxDistance = Math.max(canvas.width, canvas.height)
      let testX = canvas.width / 2 + Math.cos(angle) * maxDistance
      let testY = canvas.height / 2 + Math.sin(angle) * maxDistance

      // Clamp to borders with margin
      if (testX < margin) {
        const ratio = (margin - canvas.width / 2) / (testX - canvas.width / 2)
        testX = margin
        testY = canvas.height / 2 + (testY - canvas.height / 2) * ratio
      } else if (testX > canvas.width - margin) {
        const ratio =
          (canvas.width - margin - canvas.width / 2) /
          (testX - canvas.width / 2)
        testX = canvas.width - margin
        testY = canvas.height / 2 + (testY - canvas.height / 2) * ratio
      }

      if (testY < margin) {
        const ratio = (margin - canvas.height / 2) / (testY - canvas.height / 2)
        testY = margin
        testX = canvas.width / 2 + (testX - canvas.width / 2) * ratio
      } else if (testY > canvas.height - margin) {
        const ratio =
          (canvas.height - margin - canvas.height / 2) /
          (testY - canvas.height / 2)
        testY = canvas.height - margin
        testX = canvas.width / 2 + (testX - canvas.width / 2) * ratio
      }

      x = testX
      y = testY
      onBorder = true
    }

    return { x, y, onBorder }
  }

  function drawEnemyIndicators() {
    enemies.forEach(enemy => {
      const indicator = getIndicatorPosition(enemy)

      // Only draw if enemy is off-screen
      if (indicator.onBorder) {
        ctx.save()
        ctx.globalAlpha = enemyIndicator.opacity

        // Draw arrow pointing to enemy
        const dx = enemy.x - canvas.width / 2
        const dy = enemy.y - canvas.height / 2
        const angle = Math.atan2(dy, dx)

        ctx.translate(indicator.x, indicator.y)
        ctx.rotate(angle)

        // Draw arrow triangle
        ctx.fillStyle = enemyIndicator.color
        ctx.beginPath()
        ctx.moveTo(enemyIndicator.size, 0)
        ctx.lineTo(-enemyIndicator.size / 2, -enemyIndicator.size / 2)
        ctx.lineTo(-enemyIndicator.size / 2, enemyIndicator.size / 2)
        ctx.closePath()
        ctx.fill()

        // Draw outline
        ctx.strokeStyle = '#b9e9f8dc'
        ctx.lineWidth = 2
        ctx.stroke()

        ctx.restore()
      }
    })
  }

  function drawBullets() {
    bullets.forEach(bullet => {
      ctx.beginPath()
      ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2)
      if (bullet.lifetime != null)
        ctx.fillStyle =
          'rgb(' +
          255 * Math.min(bullet.lifetime / 10, 1).toString() +
          ',' +
          255 * Math.min(bullet.lifetime / 10, 1).toString() +
          ', 0)'
      else ctx.fillStyle = 'yellow'
      ctx.fill()
      ctx.closePath()
    })
  }

  function updatePlatforms() {
    platforms.forEach(platform => {
      if (platform.speedX) {
        platform.x += platform.speedX * platform.direction
        if (platform.maxX !== undefined && platform.minX !== undefined) {
          if (platform.x > platform.maxX || platform.x < platform.minX) {
            platform.direction *= -1
          }
        } else if (
          platform.x > platform.maxX ||
          platform.x < platform.maxX - 200
        ) {
          platform.direction *= -1
        }
      }
      if (platform.speedY) {
        platform.y += platform.speedY * platform.direction
        if (platform.y > platform.maxY || platform.y < platform.minY) {
          platform.direction *= -1
        }
      }
    })
  }

  function drawPlatforms() {
    platforms.forEach(platform => {
      // Draw minimalist platform with cosmic glow
      ctx.fillStyle = platform.gradient
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height)

      // Outer glow effect
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
        platform.y, // - 15,
        platform.width * 2, // + 20,
        platform.height // + 30
      )

      // Minimalist outline - thin neon line
      const outlineColor =
        platform.design === 'metal'
          ? 'rgba(0, 212, 255, 0.8)'
          : platform.design === 'ancient'
          ? 'rgba(255, 0, 128, 0.8)'
          : 'rgba(0, 255, 136, 0.8)'

      ctx.strokeStyle = outlineColor
      ctx.lineWidth = 1
      ctx.strokeRect(platform.x, platform.y, platform.width, platform.height)

      // Subtle corner accents
      ctx.strokeStyle = outlineColor
      ctx.globalAlpha = 0.5
      ctx.lineWidth = 1

      // Corner markers
      // const cornerSize = 8;
      // ctx.beginPath();
      // ctx.moveTo(platform.x, platform.y);
      // ctx.lineTo(platform.x + cornerSize, platform.y);
      // ctx.stroke();

      // ctx.beginPath();
      // ctx.moveTo(platform.x, platform.y);
      // ctx.lineTo(platform.x, platform.y + cornerSize);
      // ctx.stroke();

      // ctx.beginPath();
      // ctx.moveTo(platform.x + platform.width, platform.y);
      // ctx.lineTo(platform.x + platform.width - cornerSize, platform.y);
      // ctx.stroke();

      // ctx.beginPath();
      // ctx.moveTo(platform.x + platform.width, platform.y);
      // ctx.lineTo(platform.x + platform.width, platform.y + cornerSize);
      // ctx.stroke();

      ctx.globalAlpha = 1
    })
  }

  function checkPlatformCollisions() {
    let onPlatform = false
    if (!keys['S']) {
      platforms.forEach(platform => {
        if (
          player.x + player.radius > platform.x &&
          player.x - player.radius < platform.x + platform.width
        ) {
          // Landing on platform
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

            // Move player with platform
            if (platform.speedX) {
              player.x += platform.speedX * platform.direction
            }
          }
        }
      })
    }
    return onPlatform
  }

  function updateBonuses() {
    const now = Date.now()
    for (let i = bonuses.length - 1; i >= 0; i--) {
      const bonus = bonuses[i]
      const dx = player.x - bonus.x
      const dy = player.y - bonus.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      bonus.x += (dx / distance) * bonus.speed
      bonus.y += (dy / distance) * bonus.speed

      // Update sparkle effect
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
        bonus.nextSparkle = now + 100 // Sparkle every 100ms
      }

      // Check player collision
      if (distance < player.radius + bonus.radius) {
        // Create pickup effect
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

        createPickupSound(bonus.type)

        if (bonus.type === 'machineGun') {
          machineGunEndTime = Date.now() + machineGunDuration
        } else if (bonus.type === 'health') {
          // Allow HP to go above max
          player.currentHp += 10
        } else {
          shotgunEndTime = Date.now() + shotgunDuration
        }
        bonuses.splice(i, 1)
      }
    }
  }

  function drawBonuses() {
    const now = Date.now()
    bonuses.forEach(bonus => {
      // Draw glow effect
      const gradient = ctx.createRadialGradient(
        bonus.x,
        bonus.y,
        bonus.radius * 0.5,
        bonus.x,
        bonus.y,
        bonus.radius * 2
      )
      if (bonus.type != 'shotgun')
        gradient.addColorStop(
          0,
          bonus.type === 'health'
            ? 'rgba(0, 255, 0, 0.3)'
            : 'rgba(255, 255, 0, 0.3)'
        )
      else gradient.addColorStop(0, 'rgba(135, 80, 255, 0.3)')
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

      ctx.beginPath()
      ctx.arc(bonus.x, bonus.y, bonus.radius * 2, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      // Draw main bonus circle with pulsing effect
      const pulse = Math.sin(now * 0.01) * 0.2 + 0.8
      ctx.beginPath()
      ctx.arc(bonus.x, bonus.y, bonus.radius * pulse, 0, Math.PI * 2)
      ctx.fillStyle = bonus.color
      ctx.fill()

      // Draw icon inside
      ctx.fillStyle = 'black'
      ctx.font = 'bold 12px Arial'
      ctx.textAlign = 'center'
      //ctx.fillText(bonus.type === 'machineGun' ? 'MG' : 'HP', bonus.x, bonus.y + 4);
      ctx.textAlign = 'left'
    })
  }

  function updateDifficulty() {
    const timePlayed = (Date.now() - difficulty.startTime) / 1000
    const normalizedTime = Math.min(
      timePlayed / difficulty.difficultyScale.timeToMax,
      1
    )

    // Use power curve to slow down difficulty increase over time
    const difficultyMultiplier =
      1 +
      Math.pow(normalizedTime, 1 / difficulty.difficultyScale.curve) *
        (difficulty.difficultyScale.max - difficulty.difficultyScale.initial)

    difficulty.enemySpeedMultiplier = Math.min(
      difficulty.maxEnemySpeed,
      difficultyMultiplier
    )

    // Spawn rate decreases more gradually
    difficulty.enemySpawnRateMultiplier = Math.max(
      0.1,
      1 - normalizedTime * 0.9
    )
  }

  let enemySpawnTimer = 0

  function updateEnemySpawning() {
    const now = Date.now()
    const adjustedInterval = Math.max(
      difficulty.minSpawnInterval,
      enemySpawnInterval * difficulty.enemySpawnRateMultiplier
    )

    if (now - enemySpawnTimer >= adjustedInterval) {
      spawnEnemy()
      enemySpawnTimer = now
    }
  }

  // Add after generatePlatforms but before update function
  function generateTrampolines() {
    const startX = canvas.width / (trampolines.count + 1)
    return Array.from({ length: trampolines.count }, (_, i) => ({
      x: startX * (i + 1) - trampolines.width / 2,
      y: canvas.height - 30,
      width: trampolines.width,
      height: trampolines.height,
      isActive: false,
      activationTime: 0,
    }))
  }

  function drawTrampolines(trampolineList) {
    trampolineList.forEach(trampoline => {
      // Draw spring base
      ctx.fillStyle = '#666'
      ctx.fillRect(
        trampoline.x + 10,
        trampoline.y + trampolines.height,
        trampolines.width - 20,
        10
      )

      // Draw bouncing surface
      ctx.fillStyle = trampoline.isActive
        ? trampolines.activeColor
        : trampolines.color
      ctx.beginPath()
      ctx.moveTo(trampoline.x, trampoline.y)
      ctx.lineTo(trampoline.x + trampolines.width, trampoline.y)
      ctx.lineTo(
        trampoline.x + trampolines.width - 5,
        trampoline.y + trampolines.height
      )
      ctx.lineTo(trampoline.x + 5, trampoline.y + trampolines.height)
      ctx.fill()
    })
  }

  function checkTrampolineCollisions(trampolineList) {
    trampolineList.forEach(trampoline => {
      if (
        player.x + player.radius > trampoline.x &&
        player.x - player.radius < trampoline.x + trampoline.width &&
        player.y + player.radius > trampoline.y &&
        player.y - player.radius < trampoline.y + trampolines.height &&
        player.velocityY > 0
      ) {
        player.velocityY = trampolines.bounceForce
        player.isJumping = true
        player.isDJumping = false
        trampoline.isActive = true
        trampoline.activationTime = Date.now()
        createTrampolineSound()

        // Add bounce particles
        for (let i = 0; i < 8; i++) {
          particles.push(
            createParticle(
              player.x,
              trampoline.y,
              trampolines.activeColor,
              'spark'
            )
          )
        }
      }

      // Reset trampoline animation
      if (trampoline.isActive && Date.now() - trampoline.activationTime > 200) {
        trampoline.isActive = false
      }
    })
  }

  // Add trampoline sound function with other sound functions
  function createTrampolineSound() {
    const oscillator = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(200, audioCtx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(
      600,
      audioCtx.currentTime + 0.1
    )

    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2)

    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)

    oscillator.start()
    oscillator.stop(audioCtx.currentTime + 0.2)
  }

  // Add after other variables near the top
  let gameTrampolines = []

  const targetFPS = 60
  const msPerFrame = 1000 / targetFPS // Milliseconds per frame for 60 FPS

  let lastFrameTimeMs = 0 // The time when the last frame was rendered

  function update(currentTimeMs) {
    if (destroyed) return
    rafId = requestAnimationFrame(update)

    // Calculate the time elapsed since the last frame
    const deltaTimeMs = currentTimeMs - lastFrameTimeMs

    // Only render if enough time has passed to achieve the target FPS
    if (deltaTimeMs >= msPerFrame) {
      lastFrameTimeMs = currentTimeMs - (deltaTimeMs % msPerFrame) // Adjust lastFrameTimeMs for accuracy

      if (gameOver) return

      updateDifficulty()
      updateEnemySpawning()

      // Apply gravity
      player.velocityY += gravity

      // Update platforms and check collisions
      updatePlatforms()
      const onPlatform = checkPlatformCollisions()

      // Only apply ground collision if not on platform
      if (!onPlatform && player.y > groundY) {
        player.y = groundY
        player.velocityY = 0
        player.isJumping = false
        player.isDJumping = false
      }

      // Continuous horizontal movement
      if (keys.A) player.velocityX -= player.speed * 0.2
      if (keys.D) player.velocityX += player.speed * 0.2

      // Apply velocities
      player.y += player.velocityY
      player.x += player.velocityX

      // Ground collision
      if (player.y > groundY) {
        player.y = groundY
        player.velocityY = 0
        player.isJumping = false
        player.isDJumping = false
      }

      // Wall collisions
      if (player.x < player.radius) {
        player.x = player.radius
        player.velocityX = 0
      }
      if (player.x > canvas.width - player.radius) {
        player.x = canvas.width - player.radius
        player.velocityX = 0
      }

      // Apply friction
      player.velocityX *= friction

      updateEnemies()
      updateBullets()
      updateParticles()
      updateBonuses()
      checkTrampolineCollisions(gameTrampolines)

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawBackground()
      drawPlatforms()
      drawParticles()
      drawPlayer()
      drawGun()
      drawEnemies()
      drawBullets()
      drawBonuses()
      drawTrampolines(gameTrampolines)
      drawEnemyIndicators()
      drawUI()
    }
  }

  function drawGun() {
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

  function handleInput(event) {
    switch (event.key.toUpperCase()) {
      case 'A':
        //player.velocityX -= player.speed;
        break
      case 'D':
        //player.velocityX += player.speed;
        break
      case 'W':
        if (!player.isJumping) {
          player.velocityY = physics.maxJumpVelocity
          player.isJumping = true
          createJumpSound()
        } else if (!player.isDJumping) {
          player.velocityY = physics.maxJumpVelocity
          player.isDJumping = true
          createJumpSound()
        }
        break
      case 'Ц':
        if (!player.isJumping) {
          player.velocityY = physics.maxJumpVelocity
          player.isJumping = true
          createJumpSound()
        } else if (!player.isDJumping) {
          player.velocityY = physics.maxJumpVelocity * 0.8
          player.isDJumping = true
          createJumpSound()
        }
        break
    }
  }

  // Add key release handler
  function handleKeyUp(event) {
    if (
      (event.key.toUpperCase() === 'W' || event.key.toUpperCase() === 'Ц') &&
      player.velocityY < physics.minJumpVelocity
    ) {
      // Cut the jump short if player releases jump button while still rising
      player.velocityY = physics.minJumpVelocity
    }
  }

  const onKeyDown = event => {
    keys[event.key.toUpperCase()] = true
    if (event.key.toUpperCase() == 'Ф') {
      keys['A'] = true
    }
    if (event.key.toUpperCase() == 'В') {
      keys['D'] = true
    }
    if (event.key.toUpperCase() == 'Ы') {
      keys['S'] = true
    }
    handleInput(event)
  }

  const onKeyUp = event => {
    keys[event.key.toUpperCase()] = false
    if (event.key.toUpperCase() == 'Ф') {
      keys['A'] = false
    }
    if (event.key.toUpperCase() == 'В') {
      keys['D'] = false
    }
    if (event.key.toUpperCase() == 'Ы') {
      keys['S'] = false
    }
    handleKeyUp(event)
  }

  const onMouseDown = event => {
    if (gameOver) return

    const pos = getMousePos(event)
    mouseX = pos.x
    mouseY = pos.y

    const now = Date.now()
    if (now < shotgunEndTime) {
      bigshoot()
    } else {
      shoot()
    }
  }

  const onMouseMove = event => {
    const pos = getMousePos(event)
    mouseX = pos.x
    mouseY = pos.y
  }

  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  canvas.addEventListener('mousedown', onMouseDown)
  canvas.addEventListener('mousemove', onMouseMove)

  // Start the game loop
  gameTrampolines = generateTrampolines()
  initializeStars()
  generatePlatforms()
  rafId = requestAnimationFrame(update)

  // Start enemy spawning
  const enemySpawnTimerId = setInterval(spawnEnemy, enemySpawnInterval)
  // Start bonus spawning
  const bonusSpawnTimerId = setInterval(spawnBonus, bonusSpawnInterval)

  function spawnBonus() {
    const side = Math.floor(Math.random() * 4) // 0: top, 1: right, 2: bottom, 3: left
    let x, y

    switch (side) {
      case 0: // top
        x = Math.random() * canvas.width
        y = -20
        break
      case 1: // right
        x = canvas.width + 20
        y = Math.random() * canvas.height
        break
      case 2: // bottom
        x = Math.random() * canvas.width
        y = canvas.height + 20
        break
      case 3: // left
        x = -20
        y = Math.random() * canvas.height
        break
    }

    // Create bonus with random type
    const isHealthBonus = Math.random() < 0.5
    if (!isHealthBonus && Math.random() < 0.1) {
      bonuses.push({
        x,
        y,
        radius: bonusRadius,
        type: 'shotgun',
        color: shotgun_color,
        speed: 2,
        nextSparkle: Date.now(), // for sparkle effect timing
      })
    } else {
      bonuses.push({
        x,
        y,
        radius: bonusRadius,
        type: isHealthBonus ? 'health' : 'machineGun',
        color: isHealthBonus ? hp_color : ammo_color,
        speed: 2,
        nextSparkle: Date.now(), // for sparkle effect timing
      })
    }
  }

  // Add after canvas setup
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)()

  function createShootSound() {
    const oscillator = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()

    oscillator.type = 'square'
    oscillator.frequency.setValueAtTime(200, audioCtx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(
      50,
      audioCtx.currentTime + 0.1
    )

    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1)

    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)

    oscillator.start()
    oscillator.stop(audioCtx.currentTime + 0.1)
  }

  function createEnemyDeathSound() {
    const oscillator = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()

    oscillator.type = 'sawtooth'
    oscillator.frequency.setValueAtTime(150, audioCtx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(
      40,
      audioCtx.currentTime + 0.2
    )

    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2)

    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)

    oscillator.start()
    oscillator.stop(audioCtx.currentTime + 0.2)
  }

  function createPickupSound(type) {
    const oscillator = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()

    oscillator.type = 'sine'
    if (type === 'health') {
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(
        880,
        audioCtx.currentTime + 0.1
      )
    } else {
      // machine gun
      oscillator.frequency.setValueAtTime(580, audioCtx.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(
        1160,
        audioCtx.currentTime + 0.15
      )
    }

    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2)

    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)

    oscillator.start()
    oscillator.stop(audioCtx.currentTime + 0.2)
  }

  function createJumpSound() {
    const oscillator = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(200, audioCtx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(
      400,
      audioCtx.currentTime + 0.1
    )

    gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1)

    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)

    oscillator.start()
    oscillator.stop(audioCtx.currentTime + 0.1)
  }

  // Add after other sound functions
  function createDamageSound() {
    const oscillator = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()

    oscillator.type = 'square'
    oscillator.frequency.setValueAtTime(100, audioCtx.currentTime)
    oscillator.frequency.linearRampToValueAtTime(
      300,
      audioCtx.currentTime + 0.1
    )
    oscillator.frequency.linearRampToValueAtTime(50, audioCtx.currentTime + 0.2)

    gainNode.gain.setValueAtTime(0.4, audioCtx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2)

    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)

    oscillator.start()
    oscillator.stop(audioCtx.currentTime + 0.2)
  }

  function createFailureSound() {
    const oscillator = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(400, audioCtx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(
      200,
      audioCtx.currentTime + 0.2
    )

    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2)

    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)

    oscillator.start()
    oscillator.stop(audioCtx.currentTime + 0.2)
  }

  return {
    restart: () => {
      resetGame()
    },
    stop: () => {
      destroyed = true
      cancelAnimationFrame(rafId)
      clearInterval(enemySpawnTimerId)
      clearInterval(bonusSpawnTimerId)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      canvas.removeEventListener('mousedown', onMouseDown)
      canvas.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('contextmenu', preventContextMenu)
      try {
        if (audioCtx && audioCtx.state !== 'closed') {
          audioCtx.close()
        }
      } catch {
        // Ignore audio context close errors on teardown
      }
    },
  }
}
