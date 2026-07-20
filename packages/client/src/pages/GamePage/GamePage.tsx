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

export const GamePage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const controllerRef = useRef<GameController | null>(null)
  const [gameOver, setGameOver] = useState<GameOverPayload | null>(null)

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
        flex="1"
        position="relative"
        display="flex"
        justifyContent="center"
        alignItems="center"
        overflow="hidden"
        bg="#0a1a4d">
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
      </Box>
    </Box>
  )
}
