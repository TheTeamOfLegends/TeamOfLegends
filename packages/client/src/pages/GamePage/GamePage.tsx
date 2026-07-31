import { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Box } from '@chakra-ui/react'

import { Header } from '../../components/Header/Header'
import {
  startGame,
  type GameController,
  type GameHudState,
  type GameOverPayload,
} from '../../game/spaceAssaultGame'
import { GameHud } from './GameHud'
import { GameOverOverlay } from './GameOverOverlay'
import { PauseOverlay } from './PauseOverlay'

const INITIAL_HUD: GameHudState = {
  score: 0,
  hp: 100,
  maxHp: 100,
  machineGunRemainingMs: 0,
  shotgunRemainingMs: 0,
}

export const GamePage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const controllerRef = useRef<GameController | null>(null)
  const [gameOver, setGameOver] = useState<GameOverPayload | null>(null)
  const [paused, setPaused] = useState(false)
  const [hud, setHud] = useState<GameHudState>(INITIAL_HUD)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const controller = startGame(canvas, {
      onGameOver: payload => {
        setGameOver(payload)
        setPaused(false)
      },
      onHudUpdate: nextHud => {
        setHud(nextHud)
      },
      onPauseChange: isPaused => {
        setPaused(isPaused)
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
        {!gameOver && <GameHud hud={hud} />}
        {paused && !gameOver && <PauseOverlay onResume={handleResume} />}
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
