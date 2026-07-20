/**
 * Custom hook for audio management and playback
 */

import { useState, useCallback } from 'react'
import { AudioService } from '@/services/audioService'
import { logger } from '@/utils/logger'

export interface AudioPlaybackState {
  isPlaying: boolean
  currentTrackId?: string
  volume: number
  isLooping: boolean
}

export function useAudio() {
  const [playbackState, setPlaybackState] = useState<AudioPlaybackState>({
    isPlaying: false,
    volume: 0.7,
    isLooping: false,
  })

  const [error, setError] = useState<string | null>(null)
  const [isSupported] = useState(AudioService.isAudioSupported())
  // const currentAudioRef = useRef<HTMLAudioElement | null>(null)

  /**
   * Initialize audio context
   */
  const initAudio = useCallback(async () => {
    try {
      await AudioService.resumeAudioContext()
      setError(null)
      logger.debug('useAudio: Audio initialized')
      return true
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Audio initialization failed'
      setError(errorMsg)
      logger.error('useAudio: Initialization failed', err)
      return false
    }
  }, [])

  /**
   * Play frequency
   */
  const playFrequency = useCallback(
    (frequency: number, duration: number = 5000) => {
      try {
        AudioService.playFrequency(frequency, duration)
        setPlaybackState(prev => ({
          ...prev,
          isPlaying: true,
          currentTrackId: `freq-${frequency}`,
        }))
        setError(null)
        logger.info('useAudio: Frequency playing', { frequency, duration })
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to play frequency'
        setError(errorMsg)
        logger.error('useAudio: Failed to play frequency', err)
      }
    },
    []
  )

  /**
   * Stop frequency
   */
  const stopFrequency = useCallback(() => {
    try {
      AudioService.stopFrequency()
      setPlaybackState(prev => ({
        ...prev,
        isPlaying: false,
        currentTrackId: undefined,
      }))
      logger.debug('useAudio: Frequency stopped')
    } catch (err) {
      logger.error('useAudio: Failed to stop frequency', err)
    }
  }, [])

  /**
   * Play breathing guide
   */
  const playBreathingGuide = useCallback(
    async (audioUrl: string) => {
      try {
        await AudioService.playBreathingGuide(audioUrl, playbackState.volume)
        setPlaybackState(prev => ({
          ...prev,
          isPlaying: true,
          currentTrackId: audioUrl,
        }))
        setError(null)
        logger.info('useAudio: Breathing guide playing', { audioUrl })
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to play breathing guide'
        setError(errorMsg)
        logger.error('useAudio: Failed to play breathing guide', err)
      }
    },
    [playbackState.volume]
  )

  /**
   * Play affirmation
   */
  const playAffirmation = useCallback(
    async (audioUrl: string) => {
      try {
        await AudioService.playAffirmation(audioUrl, playbackState.volume)
        setPlaybackState(prev => ({
          ...prev,
          isPlaying: true,
          currentTrackId: audioUrl,
        }))
        setError(null)
        logger.info('useAudio: Affirmation playing', { audioUrl })
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to play affirmation'
        setError(errorMsg)
        logger.error('useAudio: Failed to play affirmation', err)
      }
    },
    [playbackState.volume]
  )

  /**
   * Play ambient sound
   */
  const playAmbientSound = useCallback(
    async (audioUrl: string, loop: boolean = true) => {
      try {
        await AudioService.playAmbientSound(audioUrl, playbackState.volume, loop)
        setPlaybackState(prev => ({
          ...prev,
          isPlaying: true,
          currentTrackId: audioUrl,
          isLooping: loop,
        }))
        setError(null)
        logger.info('useAudio: Ambient sound playing', { audioUrl, loop })
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to play ambient sound'
        setError(errorMsg)
        logger.error('useAudio: Failed to play ambient sound', err)
      }
    },
    [playbackState.volume]
  )

  /**
   * Set volume
   */
  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume))
    try {
      AudioService.setVolume(clampedVolume)
      setPlaybackState(prev => ({
        ...prev,
        volume: clampedVolume,
      }))
      logger.debug('useAudio: Volume set', { volume: clampedVolume })
    } catch (err) {
      logger.error('useAudio: Failed to set volume', err)
    }
  }, [])

  /**
   * Play beep sound
   */
  const playBeep = useCallback((frequency: number = 800, duration: number = 100) => {
    try {
      AudioService.playBeep(frequency, duration)
      logger.debug('useAudio: Beep played')
    } catch (err) {
      logger.error('useAudio: Failed to play beep', err)
    }
  }, [])

  /**
   * Get frequency info
   */
  const getFrequencyInfo = useCallback((frequency: number) => {
    return AudioService.getFrequencyInfo(frequency)
  }, [])

  /**
   * Request microphone permission
   */
  const requestMicrophonePermission = useCallback(async () => {
    try {
      const granted = await AudioService.requestMicrophonePermission()
      if (granted) {
        setError(null)
        logger.info('useAudio: Microphone permission granted')
      } else {
        setError('Permissão de microfone negada')
        logger.warn('useAudio: Microphone permission denied')
      }
      return granted
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to request microphone permission'
      setError(errorMsg)
      logger.error('useAudio: Microphone request failed', err)
      return false
    }
  }, [])

  /**
   * Reset audio state
   */
  const reset = useCallback(() => {
    stopFrequency()
    setPlaybackState({
      isPlaying: false,
      volume: 0.7,
      isLooping: false,
    })
    setError(null)
  }, [stopFrequency])

  return {
    // State
    playbackState,
    error,
    isSupported,

    // Actions
    initAudio,
    playFrequency,
    stopFrequency,
    playBreathingGuide,
    playAffirmation,
    playAmbientSound,
    playBeep,
    setVolume,
    requestMicrophonePermission,
    reset,

    // Queries
    getFrequencyInfo,
  }
}
