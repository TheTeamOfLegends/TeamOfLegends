import { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Box } from '@chakra-ui/react'

import { Header } from '../../components/Header/Header'
import {
  startGame,
  type GameController,
  type GameOverPayload,
} from '../../game/spaceAssaultGame'
import { GameOverOverlay } from './GameOverOverlay'
import { GameStartOverlay } from './GameStartOverlay'
import { GameButton } from '@/components/ui/GameButton/GameButton'

export const GamePage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const controllerRef = useRef<GameController | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [gameOver, setGameOver] = useState<GameOverPayload | null>(null)
  const [gameStart, setGameStart] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const controller = startGame(canvas, {
      onGameOver: payload => {
        setGameOver(payload)
      },
    })

    controllerRef.current = controller

    return () => {
      controller.stop()
      controllerRef.current = null
    }
  }, [])

  useEffect(() => {
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange)
    }
  }, [])

  const onFullscreenChange = () => {
    setIsFullscreen(Boolean(document.fullscreenElement))
  }

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

  const handleStart = () => {
    controllerRef.current?.restart()
    setGameStart(false)
  }

  const handleRestart = () => {
    controllerRef.current?.restart()
    setGameOver(null)
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
