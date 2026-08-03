type AudioContextType = typeof window.AudioContext

export type GameAudio = {
  shoot: () => void
  enemyDeath: () => void
  pickup: (type: string) => void
  jump: () => void
  damage: () => void
  failure: () => void
  trampoline: () => void
  close: () => void
}

export const createGameAudio = (): GameAudio => {
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: AudioContextType })
      .webkitAudioContext
  const audioCtx = new AudioCtx()

  const playTone = ({
    type,
    startFreq,
    endFreq,
    duration,
    gain = 0.3,
    ramp = 'exponential',
  }: {
    type: OscillatorType
    startFreq: number
    endFreq: number
    duration: number
    gain?: number
    ramp?: 'exponential' | 'linear'
  }) => {
    const oscillator = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()

    oscillator.type = type
    oscillator.frequency.setValueAtTime(startFreq, audioCtx.currentTime)

    if (ramp === 'exponential') {
      oscillator.frequency.exponentialRampToValueAtTime(
        endFreq,
        audioCtx.currentTime + duration
      )
      gainNode.gain.setValueAtTime(gain, audioCtx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioCtx.currentTime + duration
      )
    } else {
      oscillator.frequency.linearRampToValueAtTime(
        endFreq,
        audioCtx.currentTime + duration * 0.5
      )
      oscillator.frequency.linearRampToValueAtTime(
        Math.max(endFreq / 2, 40),
        audioCtx.currentTime + duration
      )
      gainNode.gain.setValueAtTime(gain, audioCtx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioCtx.currentTime + duration
      )
    }

    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)
    oscillator.start()
    oscillator.stop(audioCtx.currentTime + duration)
  }

  return {
    shoot: () =>
      playTone({
        type: 'square',
        startFreq: 200,
        endFreq: 50,
        duration: 0.1,
      }),
    enemyDeath: () =>
      playTone({
        type: 'sawtooth',
        startFreq: 150,
        endFreq: 40,
        duration: 0.2,
      }),
    pickup: type =>
      playTone({
        type: 'sine',
        startFreq: type === 'health' ? 440 : 580,
        endFreq: type === 'health' ? 880 : 1160,
        duration: type === 'health' ? 0.1 : 0.15,
        gain: 0.2,
      }),
    jump: () =>
      playTone({
        type: 'sine',
        startFreq: 200,
        endFreq: 400,
        duration: 0.1,
        gain: 0.15,
      }),
    damage: () =>
      playTone({
        type: 'square',
        startFreq: 100,
        endFreq: 300,
        duration: 0.2,
        gain: 0.4,
        ramp: 'linear',
      }),
    failure: () =>
      playTone({
        type: 'sine',
        startFreq: 400,
        endFreq: 200,
        duration: 0.2,
        gain: 0.2,
      }),
    trampoline: () =>
      playTone({
        type: 'sine',
        startFreq: 200,
        endFreq: 600,
        duration: 0.2,
      }),
    close: () => {
      try {
        if (audioCtx.state !== 'closed') {
          void audioCtx.close()
        }
      } catch {
        // ignore close errors
      }
    },
  }
}
