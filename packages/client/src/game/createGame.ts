import { createGameAudio } from './audio'
import {
  createStarryNight,
  drawBackground,
  initializeStars,
} from './background'
import {
  bigShoot,
  createDifficulty,
  shoot,
  spawnBonus,
  spawnEnemy,
  updateBonuses,
  updateBullets,
  updateDifficulty,
  updateEnemies,
} from './combat'
import { COMBAT, MS_PER_FRAME, PHYSICS } from './constants'
import { loadGameAssets } from './gameAssets'
import { drawParticles, updateParticles } from './particles'
import {
  checkPlatformCollisions,
  drawPlatforms,
  generatePlatforms,
  updatePlatforms,
} from './platforms'
import {
  drawBonuses,
  drawBullets,
  drawEnemies,
  drawEnemyIndicators,
  drawPlayer,
  drawPlayerGun,
  drawMouseLine,
} from './render'
import { getHighScore, saveHighScore } from './scoreStorage'
import {
  checkTrampolineCollisions,
  drawTrampolines,
  generateTrampolines,
} from './trampolines'
import type {
  Bonus,
  Bullet,
  Enemy,
  GameController,
  Particle,
  Player,
  Platform,
  StartGameOptions,
  Trampoline,
} from './types'
import type { Theme } from '../theme/ThemeContext'

const createPlayer = (width: number, height: number): Player => ({
  x: width / 2,
  y: height / 2,
  radius: 12,
  color: 'blue',
  speed: 7.5,
  velocityY: 0,
  velocityX: 0,
  isJumping: false,
  isDJumping: false,
  maxHp: 100,
  currentHp: 100,
})

const getMousePos = (
  canvas: HTMLCanvasElement,
  event: MouseEvent
): { x: number; y: number } => {
  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  }
}

export function startGame(
  canvas: HTMLCanvasElement,
  options: StartGameOptions
): GameController {
  loadGameAssets()

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return {
      stop: () => undefined,
      restart: () => undefined,
      pause: () => undefined,
      resume: () => undefined,
      setPauseControlsEnabled: () => undefined,
    }
  }

  let destroyed = false
  let rafId = 0
  let isNewHighScore = false
  let paused = false
  let pauseStartedAt = 0
  let totalPausedMs = 0
  let pauseControlsEnabled = true

  const preventContextMenu = (event: Event) => event.preventDefault()
  document.addEventListener('contextmenu', preventContextMenu)

  canvas.width = Math.min(window.innerWidth, 1920)
  canvas.height = Math.min(window.innerHeight - 80, 1080)
  if (canvas.height < 400) {
    canvas.height = Math.min(window.innerHeight, 1080)
  }
  canvas.style.cursor = 'crosshair'

  const audio = createGameAudio()
  const starryNight = createStarryNight()
  const difficulty = createDifficulty()
  const player = createPlayer(canvas.width, canvas.height)
  const groundY = canvas.height - player.radius

  const keys: Record<string, boolean> = {
    ArrowLeft: false,
    ArrowRight: false,
    A: false,
    D: false,
    S: false,
  }

  let enemies: Enemy[] = []
  let bullets: Bullet[] = []
  let platforms: Platform[] = []
  let bonuses: Bonus[] = []
  let gameTrampolines: Trampoline[] = []
  const particles: Particle[] = []

  let lastShootTime = 0
  let mouseX = 0
  let mouseY = 0
  let score = 0
  let gameOver = false
  let machineGunEndTime = 0
  let shotgunEndTime = 0
  let highScore = getHighScore()
  let enemySpawnTimer = 0
  let lastFrameTimeMs = 0
  let lastHudEmit = 0

  /** Game clock that freezes while paused. */
  const nowGame = () =>
    Date.now() - totalPausedMs - (paused ? Date.now() - pauseStartedAt : 0)

  const emitHud = () => {
    const now = nowGame()
    options.onHudUpdate?.({
      score,
      hp: player.currentHp,
      maxHp: player.maxHp,
      machineGunRemainingMs: Math.max(0, machineGunEndTime - now),
      shotgunRemainingMs: Math.max(0, shotgunEndTime - now),
    })
  }

  const setPaused = (next: boolean) => {
    if (destroyed || gameOver || paused === next) return

    if (next) {
      pauseStartedAt = Date.now()
      paused = true
      options.onPauseChange?.(true)
    } else {
      totalPausedMs += Date.now() - pauseStartedAt
      paused = false
      options.onPauseChange?.(false)
    }
  }

  const triggerGameOver = () => {
    gameOver = true
    if (paused) {
      paused = false
      options.onPauseChange?.(false)
    }
    isNewHighScore = score > highScore
    highScore = saveHighScore(score)
    options.onGameOver?.({
      score,
      highScore,
      isNewHighScore,
    })
  }

  const resetGame = () => {
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
    bonuses = []
    particles.length = 0
    machineGunEndTime = 0
    shotgunEndTime = 0
    totalPausedMs = 0
    pauseStartedAt = 0
    gameOver = false
    if (paused) {
      paused = false
      options.onPauseChange?.(false)
    }
    difficulty.startTime = nowGame()
    difficulty.enemySpeedMultiplier = 1
    difficulty.enemySpawnRateMultiplier = 1
    gameTrampolines = generateTrampolines(canvas.width, canvas.height)
    platforms = generatePlatforms(ctx, canvas.width, canvas.height)
    emitHud()
  }

  const tryShoot = () => {
    if (gameOver || paused) return

    const now = nowGame()
    const shootCtx = {
      player,
      mouseX,
      mouseY,
      bullets,
      particles,
      lastShootTime,
      machineGunEndTime,
      now,
      onShoot: () => audio.shoot(),
    }

    lastShootTime = now < shotgunEndTime ? bigShoot(shootCtx) : shoot(shootCtx)
  }

  const updateEnemySpawning = (now: number) => {
    const adjustedInterval = Math.max(
      difficulty.minSpawnInterval,
      COMBAT.enemySpawnInterval * difficulty.enemySpawnRateMultiplier
    )

    if (now - enemySpawnTimer >= adjustedInterval) {
      spawnEnemy(enemies, player, canvas.width, canvas.height, difficulty)
      enemySpawnTimer = now
    }
  }

  const renderFrame = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawBackground(
      ctx,
      starryNight,
      canvas.width,
      canvas.height,
      options.theme.current as Theme
    )
    drawPlatforms(ctx, platforms, options.theme.current as Theme)
    drawParticles(ctx, particles)
    drawMouseLine(ctx, player, mouseX, mouseY)
    drawPlayerGun(ctx, player, mouseX, mouseY)
    drawPlayer(ctx, player, mouseX)
    drawEnemies(ctx, enemies)
    drawBullets(ctx, bullets)
    drawBonuses(ctx, bonuses)
    drawTrampolines(ctx, gameTrampolines)
    drawEnemyIndicators(ctx, enemies, canvas.width, canvas.height)
  }

  const update = (currentTimeMs: number) => {
    if (destroyed) return
    rafId = requestAnimationFrame(update)

    const deltaTimeMs = currentTimeMs - lastFrameTimeMs
    if (deltaTimeMs < MS_PER_FRAME) return

    lastFrameTimeMs = currentTimeMs - (deltaTimeMs % MS_PER_FRAME)

    if (gameOver) return

    if (paused) {
      renderFrame()
      return
    }

    const now = nowGame()
    updateDifficulty(difficulty, now)
    updateEnemySpawning(now)

    player.velocityY += PHYSICS.gravity

    updatePlatforms(platforms)
    const onPlatform = checkPlatformCollisions(player, platforms, !!keys.S)

    if (!onPlatform && player.y > groundY) {
      player.y = groundY
      player.velocityY = 0
      player.isJumping = false
      player.isDJumping = false
    }

    if (keys.A) player.velocityX -= player.speed * 0.2
    if (keys.D) player.velocityX += player.speed * 0.2

    player.y += player.velocityY
    player.x += player.velocityX

    if (player.y > groundY) {
      player.y = groundY
      player.velocityY = 0
      player.isJumping = false
      player.isDJumping = false
    }

    if (player.x < player.radius) {
      player.x = player.radius
      player.velocityX = 0
    }
    if (player.x > canvas.width - player.radius) {
      player.x = canvas.width - player.radius
      player.velocityX = 0
    }

    player.velocityX *= PHYSICS.friction

    const enemyResult = updateEnemies(
      enemies,
      player,
      () => audio.damage(),
      () => triggerGameOver()
    )

    if (!enemyResult.gameOver) {
      score += updateBullets(
        bullets,
        enemies,
        bonuses,
        particles,
        canvas.width,
        canvas.height,
        () => audio.enemyDeath(),
        () => audio.failure()
      )

      updateParticles(particles)

      const powerUps = {
        machineGunEndTime,
        shotgunEndTime,
      }
      updateBonuses(
        bonuses,
        player,
        particles,
        powerUps,
        type => audio.pickup(type),
        now
      )
      machineGunEndTime = powerUps.machineGunEndTime
      shotgunEndTime = powerUps.shotgunEndTime

      checkTrampolineCollisions(player, gameTrampolines, particles, () =>
        audio.trampoline()
      )
    }

    renderFrame()

    const hudNow = performance.now()
    if (hudNow - lastHudEmit > 100) {
      lastHudEmit = hudNow
      emitHud()
    }
  }

  const handleJump = (isCyrillicDouble: boolean) => {
    if (paused || gameOver) return
    if (!player.isJumping) {
      player.velocityY = PHYSICS.maxJumpVelocity
      player.isJumping = true
      audio.jump()
    } else if (!player.isDJumping) {
      player.velocityY = isCyrillicDouble
        ? PHYSICS.maxJumpVelocity * 0.8
        : PHYSICS.maxJumpVelocity
      player.isDJumping = true
      audio.jump()
    }
  }

  const onKeyDown = (event: KeyboardEvent) => {
    const key = event.key.toUpperCase()

    if (key === 'ESCAPE' || key === 'P' || key === 'З') {
      event.preventDefault()
      if (!gameOver && pauseControlsEnabled) setPaused(!paused)
      return
    }

    if (paused || gameOver) return

    keys[key] = true
    if (key === 'Ф') keys.A = true
    if (key === 'В') keys.D = true
    if (key === 'Ы') keys.S = true

    if (key === 'W') handleJump(false)
    if (key === 'Ц') handleJump(true)
  }

  const onKeyUp = (event: KeyboardEvent) => {
    const key = event.key.toUpperCase()
    keys[key] = false
    if (key === 'Ф') keys.A = false
    if (key === 'В') keys.D = false
    if (key === 'Ы') keys.S = false

    if (
      (key === 'W' || key === 'Ц') &&
      player.velocityY < PHYSICS.minJumpVelocity
    ) {
      player.velocityY = PHYSICS.minJumpVelocity
    }
  }

  const onMouseDown = (event: MouseEvent) => {
    if (gameOver || paused) return
    const pos = getMousePos(canvas, event)
    mouseX = pos.x
    mouseY = pos.y
    tryShoot()
  }

  const onMouseMove = (event: MouseEvent) => {
    const pos = getMousePos(canvas, event)
    mouseX = pos.x
    mouseY = pos.y
  }

  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  canvas.addEventListener('mousedown', onMouseDown)
  canvas.addEventListener('mousemove', onMouseMove)

  gameTrampolines = generateTrampolines(canvas.width, canvas.height)
  initializeStars(starryNight, canvas.width, canvas.height)
  platforms = generatePlatforms(ctx, canvas.width, canvas.height)
  difficulty.startTime = nowGame()
  enemySpawnTimer = nowGame()
  rafId = requestAnimationFrame(update)
  emitHud()

  const enemySpawnTimerId = window.setInterval(() => {
    if (!destroyed && !gameOver && !paused) {
      spawnEnemy(enemies, player, canvas.width, canvas.height, difficulty)
    }
  }, COMBAT.enemySpawnInterval)

  const bonusSpawnTimerId = window.setInterval(() => {
    if (!destroyed && !gameOver && !paused) {
      spawnBonus(bonuses, canvas.width, canvas.height)
    }
  }, COMBAT.bonusSpawnInterval)

  return {
    restart: () => {
      resetGame()
    },
    pause: () => setPaused(true),
    resume: () => setPaused(false),
    setPauseControlsEnabled: (enabled: boolean) => {
      pauseControlsEnabled = enabled
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
      audio.close()
    },
  }
}
