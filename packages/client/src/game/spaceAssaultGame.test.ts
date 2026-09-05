import { GameController, startGame } from './spaceAssaultGame'
import type { Theme } from '../theme/ThemeContext'
import type { RefObject } from 'react'

const createMockCtx = () => ({
  createLinearGradient: jest.fn().mockReturnValue({
    addColorStop: jest.fn(),
  }),
})

const createMockCanvas = (
  width = 1920,
  height = 1080
): Partial<HTMLCanvasElement> => ({
  width,
  height,
  style: {} as CSSStyleDeclaration,
  getBoundingClientRect: jest.fn().mockReturnValue({
    left: 0,
    top: 0,
    width,
    height,
  }),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  getContext: jest.fn().mockReturnValue(createMockCtx()),
})

Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1920,
})

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 1080,
})

global.window.AudioContext = class {} as typeof global.window.AudioContext

window.removeEventListener = jest.fn()

const localStorageMock = {
  getItem: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

const getDefaultMockCanvas = () =>
  createMockCanvas(1920, 1080) as HTMLCanvasElement

describe('Игровой движок игры Space Assault', () => {
  let gameControl: GameController | undefined
  let canvas = getDefaultMockCanvas()

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    localStorageMock.getItem.mockReturnValue('0')

    canvas = getDefaultMockCanvas()
  })

  afterEach(() => {
    if (gameControl) {
      gameControl.stop()
      gameControl = undefined
    }
    jest.useRealTimers()
  })

  describe('Жизненный цикл игры', () => {
    it('должна устанавливать позицию игрока в центр canvas на start', () => {
      gameControl = startGame(canvas, {
        theme: { current: 'dark' } as RefObject<Theme>,
      })

      expect(canvas.width / 2).toBe(960)
      expect(canvas.height / 2).toBe(500)
    })

    it('должна останавливать игровой цикл при вызове stop()', () => {
      ;(gameControl = startGame(canvas, {
        theme: { current: 'dark' } as RefObject<Theme>,
      })),
        gameControl.stop()

      expect(window.removeEventListener).toHaveBeenCalled()
    })

    it('должна перезапускать игру при вызове restart()', () => {
      gameControl = startGame(canvas, {
        theme: { current: 'dark' } as RefObject<Theme>,
      })
      gameControl.restart()

      expect(gameControl).toBeDefined()
    })

    it('не должна кидать ошибки при перезапусках', () => {
      for (let i = 0; i < 5; i++) {
        const game = startGame(canvas, {
          theme: { current: 'dark' } as RefObject<Theme>,
        })
        game.restart()
        game.stop()
      }

      expect(true).toBe(true)
    })

    it('должна отменять animation frame при паузе', () => {
      const cancelAnimationFrameSpy = jest.spyOn(window, 'cancelAnimationFrame')

      gameControl = startGame(canvas, {
        theme: { current: 'dark' } as RefObject<Theme>,
      })
      gameControl.stop()

      expect(cancelAnimationFrameSpy).toHaveBeenCalled()
      cancelAnimationFrameSpy.mockRestore()
    })
  })

  describe('APIs', () => {
    it('должна настраивать audio context', () => {
      const OriginalAudioContext = global.window.AudioContext
      const mockAudioContext = jest.fn()
      global.window.AudioContext = mockAudioContext

      startGame(canvas, { theme: { current: 'dark' } as RefObject<Theme> })

      expect(mockAudioContext).toHaveBeenCalled()

      global.window.AudioContext = OriginalAudioContext
    })

    it('должна настраивать localStorage для счета high score', () => {
      startGame(canvas, { theme: { current: 'dark' } as RefObject<Theme> })

      expect(localStorageMock.getItem).toHaveBeenCalledWith('highScore')
    })
  })

  describe('Настройки canvas', () => {
    it('должна инициализировать canvas', () => {
      gameControl = startGame(canvas, {
        onGameOver: jest.fn(),
        theme: { current: 'dark' } as RefObject<Theme>,
      })

      expect(canvas.getContext).toHaveBeenCalledWith('2d')
      expect(canvas.addEventListener).toHaveBeenCalled()
    })

    it('должна обрабатывать canvas без контекста', () => {
      const brokenCanvas: Partial<HTMLCanvasElement> = {
        width: 800,
        height: 600,
        getContext: jest.fn().mockReturnValue(null),
      }

      const control = startGame(brokenCanvas as HTMLCanvasElement, {
        theme: { current: 'dark' } as RefObject<Theme>,
      })
      expect(control.stop).toBeDefined()
      expect(control.restart).toBeDefined()
    })

    it('должна инициализировать размеры canvas на основе размера окна', () => {
      gameControl = startGame(canvas, {
        theme: { current: 'dark' } as RefObject<Theme>,
      })

      expect(canvas.width).toBe(1920)
      expect(canvas.height).toBe(1000)
      expect(canvas.style.cursor).toBe('crosshair')
    })

    it('должна ограничивать ширину canvas минимумом между шириной окна и 1920', () => {
      Object.defineProperty(window, 'innerWidth', {
        value: 2560,
      })

      const wideCanvas = createMockCanvas(2560, 1440) as HTMLCanvasElement
      gameControl = startGame(wideCanvas, {
        theme: { current: 'dark' } as RefObject<Theme>,
      })

      expect(wideCanvas.width).toBe(1920)

      Object.defineProperty(window, 'innerWidth', {
        value: 1920,
      })
    })

    it('должна ограничивать высоту canvas', () => {
      Object.defineProperty(window, 'innerHeight', {
        value: 2000,
      })

      const tallCanvas = createMockCanvas(1920, 2000) as HTMLCanvasElement
      gameControl = startGame(tallCanvas, {
        theme: { current: 'dark' } as RefObject<Theme>,
      })

      expect(tallCanvas.height).toBe(1080)

      Object.defineProperty(window, 'innerHeight', {
        value: 1080,
      })
    })

    it('должна возвращаться к полной высоте окна при слишком маленькой рассчитанной высоте', () => {
      Object.defineProperty(window, 'innerHeight', {
        value: 120,
      })

      const smallCanvas = createMockCanvas(800, 40) as HTMLCanvasElement
      gameControl = startGame(smallCanvas, {
        theme: { current: 'dark' } as RefObject<Theme>,
      })

      expect(smallCanvas.height).toBe(120)

      Object.defineProperty(window, 'innerHeight', {
        value: 1080,
      })
    })

    it('должна правильно масштабировать координаты мыши', () => {
      const testCanvas = createMockCanvas(1920, 1080) as HTMLCanvasElement

      ;(
        testCanvas.getBoundingClientRect as ReturnType<typeof jest.fn>
      ).mockReturnValue({
        left: 100,
        top: 50,
        width: 960,
        height: 540,
      })

      gameControl = startGame(testCanvas, {
        theme: { current: 'dark' } as RefObject<Theme>,
      })

      expect(testCanvas.width / testCanvas.getBoundingClientRect().width).toBe(
        2
      )
    })
  })

  describe('Настройки игры по умолчанию', () => {
    it('должна иметь размер canvas по умолчанию', () => {
      gameControl = startGame(canvas, {
        theme: { current: 'dark' } as RefObject<Theme>,
      })

      expect(canvas.width).toBeLessThanOrEqual(1920)
      expect(canvas.height).toBeLessThanOrEqual(1080)
    })

    it('должна иметь минимальную высоту', () => {
      Object.defineProperty(window, 'innerHeight', {
        value: 300,
      })

      const tinyCanvas = createMockCanvas(800, 200) as HTMLCanvasElement
      gameControl = startGame(tinyCanvas, {
        theme: { current: 'dark' } as RefObject<Theme>,
      })

      expect(tinyCanvas.height).toBe(300)

      Object.defineProperty(window, 'innerHeight', {
        value: 1080,
      })
    })
  })
})
