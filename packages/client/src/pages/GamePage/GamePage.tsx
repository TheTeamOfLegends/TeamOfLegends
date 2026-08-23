import { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Box } from '@chakra-ui/react'

import { Header } from '../../components/Header/Header'
import { GameButton } from '@/components/ui/GameButton/GameButton'
import {
  ensureNotificationPermission,
  showGameReturnNotification,
} from '@/api/notifications'
import {
  startGame,
  type GameController,
  type GameHudState,
  type GameOverPayload,
} from '../../game/spaceAssaultGame'
import { GameHud } from './GameHud'
import { GameOverOverlay } from './GameOverOverlay'
import { GameStartOverlay } from './GameStartOverlay'
import { PauseOverlay } from './PauseOverlay'

const INITIAL_HUD: GameHudState = {
  score: 0,
  hp: 100,
  maxHp: 100,
  machineGunRemainingMs: 0,
  shotgunRemainingMs: 0,
}

const RETURN_NOTIFICATION_DELAY_MS = 60_000

export const GamePage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const controllerRef = useRef<GameController | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hudRef = useRef<GameHudState>(INITIAL_HUD)
  const returnNotificationTimerRef = useRef<number | undefined>(undefined)

  const [gameOver, setGameOver] = useState<GameOverPayload | null>(null)
  const [paused, setPaused] = useState(false)
  const [hud, setHud] = useState<GameHudState>(INITIAL_HUD)
  const [gameStart, setGameStart] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    hudRef.current = hud
  }, [hud])

  const clearReturnNotificationTimer = () => {
    if (returnNotificationTimerRef.current !== undefined) {
      clearTimeout(returnNotificationTimerRef.current)
      returnNotificationTimerRef.current = undefined
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const controller = startGame(canvas, {
      onGameOver: payload => {
        setGameOver(payload)
        setPaused(false)
        clearReturnNotificationTimer()
      },
      onHudUpdate: nextHud => {
        setHud(nextHud)
      },
      onPauseChange: isPaused => {
        setPaused(isPaused)
      },
    })

    controller.setPauseControlsEnabled(false)
    controller.pause()
    controllerRef.current = controller

    return () => {
      clearReturnNotificationTimer()
      controller.stop()
      controllerRef.current = null
    }
  }, [])

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }

    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange)
    }
  }, [])

  useEffect(() => {
    if (gameStart || gameOver) {
      clearReturnNotificationTimer()
      return
    }

    const onVisibilityChange = () => {
      if (document.hidden) {
        controllerRef.current?.pause()

        clearReturnNotificationTimer()
        returnNotificationTimerRef.current = window.setTimeout(() => {
          showGameReturnNotification({ score: hudRef.current.score })
        }, RETURN_NOTIFICATION_DELAY_MS)
      } else {
        clearReturnNotificationTimer()
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      clearReturnNotificationTimer()
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [gameStart, gameOver])

  const handleToggleFullscreen = async () => {
    const el = containerRef.current
    if (!el) return

    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (err) {
      console.error('Fullscreen failed:', err)
    }
  }

  const handleStart = async () => {
    const controller = controllerRef.current
    if (!controller) return

    await ensureNotificationPermission()

    controller.setPauseControlsEnabled(true)
    controller.restart()
    setGameStart(false)
    setPaused(false)
  }

  const handleRestart = () => {
    controllerRef.current?.restart()
    setGameOver(null)
    setPaused(false)
    setHud(INITIAL_HUD)
  }

  const handleResume = () => {
    controllerRef.current?.resume()
  }

  return (
    <Box minH="100vh" bg="#080B2C" display="flex" flexDir="column">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Игра</title>
        <meta name="description" content="Space Assault — игровой процесс" />
      </Helmet>
      <Header />
      <Box
        ref={containerRef}
        flex="1"
        position="relative"
        display="flex"
        justifyContent="center"
        alignItems="center"
        overflow="hidden"
        bg="#0a1a4d">
        <GameButton
          position="absolute"
          top={3}
          right={3}
          zIndex={1}
          size="sm"
          onClick={handleToggleFullscreen}>
          {isFullscreen ? 'Выйти из полного экрана' : 'Полный экран'}
        </GameButton>
        <canvas
          ref={canvasRef}
          style={{
            display: 'block',
            maxWidth: '100%',
            maxHeight: '100%',
            backgroundColor: '#1a1a1a',
          }}
        />
        {!gameOver && !gameStart && <GameHud hud={hud} />}
        {paused && !gameOver && !gameStart && (
          <PauseOverlay onResume={handleResume} />
        )}
        {gameOver && (
          <GameOverOverlay
            score={gameOver.score}
            highScore={gameOver.highScore}
            isNewHighScore={gameOver.isNewHighScore}
            onRestart={handleRestart}
          />
        )}
        {gameStart && <GameStartOverlay onRestart={handleStart} />}
      </Box>
    </Box>
  )
}
