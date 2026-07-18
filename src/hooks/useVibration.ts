/**
 * Custom hook for vibration/haptic feedback
 */

import { useCallback, useRef } from 'react'
import { AudioService } from '@/services/audioService'
import { logger } from '@/utils/logger'

export interface VibrationPattern {
  name: string
  pattern: number | number[]
  description: string
}

export const VIBRATION_PATTERNS: Record<string, VibrationPattern> = {
  tap: {
    name: 'Tap',
    pattern: 50,
    description: 'Single tap vibration',
  },
  doubleTap: {
    name: 'Double Tap',
    pattern: [100, 50, 100],
    description: 'Double tap pattern',
  },
  tripleTap: {
    name: 'Triple Tap',
    pattern: [50, 30, 50, 30, 50],
    description: 'Triple tap pattern',
  },
  alert: {
    name: 'Alert',
    pattern: [200, 100, 200, 100, 200],
    description: 'SOS alert pattern',
  },
  success: {
    name: 'Success',
    pattern: [50, 30, 50, 30, 50, 30, 100],
    description: 'Success confirmation',
  },
  pulse: {
    name: 'Pulse',
    pattern: [100, 200, 100],
    description: 'Pulsing pattern',
  },
  contractionStart: {
    name: 'Contraction Start',
    pattern: [100, 50, 100],
    description: 'Contraction detected',
  },
  contractionEnd: {
    name: 'Contraction End',
    pattern: [50, 30, 50, 30, 50],
    description: 'Contraction ended',
  },
}

export function useVibration() {
  const vibrationRef = useRef<boolean>(AudioService.isVibrationSupported())
  const isVibrationEnabled = useCallback(() => vibrationRef.current, [])

  /**
   * Vibrate with pattern
   */
  const vibrate = useCallback((pattern: number | number[] = 50): boolean => {
    if (!vibrationRef.current) {
      logger.warn('useVibration: Vibration not supported')
      return false
    }

    try {
      const success = AudioService.vibrate(pattern)
      if (success) {
        logger.debug('useVibration: Vibration triggered')
      }
      return success
    } catch (error) {
      logger.error('useVibration: Vibration failed', error)
      return false
    }
  }, [])

  /**
   * Vibrate with predefined pattern
   */
  const vibratePattern = useCallback((patternName: keyof typeof VIBRATION_PATTERNS): boolean => {
    const pattern = VIBRATION_PATTERNS[patternName]
    if (!pattern) {
      logger.warn(`useVibration: Unknown pattern "${patternName}"`)
      return false
    }

    return vibrate(pattern.pattern)
  }, [vibrate])

  /**
   * Contraction detected vibration
   */
  const vibrateContractionDetected = useCallback((): boolean => {
    return vibratePattern('contractionStart')
  }, [vibratePattern])

  /**
   * Contraction ended vibration
   */
  const vibrateContractionEnded = useCallback((): boolean => {
    return vibratePattern('contractionEnd')
  }, [vibratePattern])

  /**
   * Alert vibration
   */
  const vibrateAlert = useCallback((): boolean => {
    return vibratePattern('alert')
  }, [vibratePattern])

  /**
   * Success vibration
   */
  const vibrateSuccess = useCallback((): boolean => {
    return vibratePattern('success')
  }, [vibratePattern])

  /**
   * Pulse vibration
   */
  const vibratePulse = useCallback((): boolean => {
    return vibratePattern('pulse')
  }, [vibratePattern])

  /**
   * Custom vibration sequence
   */
  const vibrateSequence = useCallback(
    async (patterns: (number | number[])[], delayMs: number = 500): Promise<void> => {
      for (const pattern of patterns) {
        vibrate(pattern)
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
    },
    [vibrate]
  )

  /**
   * Continuous vibration until stopped
   */
  const vibrateRepeat = useCallback(
    (pattern: number | number[], intervalMs: number = 1000): (() => void) => {
      const intervalId = setInterval(() => {
        vibrate(pattern)
      }, intervalMs)

      return () => clearInterval(intervalId)
    },
    [vibrate]
  )

  /**
   * Get all available patterns
   */
  const getAvailablePatterns = useCallback(() => {
    return Object.entries(VIBRATION_PATTERNS).map(([key, value]) => ({
      id: key,
      ...value,
    }))
  }, [])

  /**
   * Check if pattern exists
   */
  const patternExists = useCallback((patternName: string): boolean => {
    return patternName in VIBRATION_PATTERNS
  }, [])

  return {
    // State
    isVibrationSupported: isVibrationEnabled(),

    // Actions
    vibrate,
    vibratePattern,
    vibrateContractionDetected,
    vibrateContractionEnded,
    vibrateAlert,
    vibrateSuccess,
    vibratePulse,
    vibrateSequence,
    vibrateRepeat,

    // Queries
    getAvailablePatterns,
    patternExists,
  }
}
