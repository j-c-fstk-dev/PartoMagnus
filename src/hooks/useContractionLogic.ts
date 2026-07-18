/**
 * Custom hook for contraction tracking logic
 */

import { useState, useCallback, useRef } from 'react'
import { Contraction, ContractionPattern } from '@/types/labor'
import { analyzeContractionPattern } from '@/utils/algorithms'
import { logger } from '@/utils/logger'
import { AudioService } from '@/services/audioService'

export interface ContractionInput {
  duration: number // in seconds
  intensity: 'LEVE' | 'MODERADA' | 'FORTE'
  notes?: string
}

export function useContractionLogic() {
  const [contractions, setContractions] = useState<Contraction[]>([])
  const [pattern, setPattern] = useState<ContractionPattern | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const contractionStartTime = useRef<number | null>(null)
  const contractionStarted = useRef(false)

  /**
   * Add a new contraction
   */
  const addContraction = useCallback((input: ContractionInput) => {
    try {
      const newContraction: Contraction = {
        id: crypto.randomUUID(),
        sessionId: '', // Will be set by parent
        startTime: Date.now(),
        duration: input.duration,
        intensity: input.intensity,
        notes: input.notes,
        createdAt: new Date().toISOString(),
      }

      setContractions(prev => {
        const updated = [...prev, newContraction]

        // Calculate interval to previous contraction
        if (updated.length > 1) {
          const prevContraction = updated[updated.length - 2]
          const interval = newContraction.startTime - prevContraction.startTime
          newContraction.interval = interval
        }

        // Update pattern
        const newPattern = analyzeContractionPattern(updated)
        setPattern(newPattern)

        logger.debug('useContractionLogic: Contraction added', {
          contractionCount: updated.length,
          pattern: newPattern,
        })

        // Haptic feedback
        AudioService.vibrateContractionDetected()

        return updated
      })

      setError(null)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMsg)
      logger.error('useContractionLogic: Failed to add contraction', err)
    }
  }, [])

  /**
   * Start tracking contraction
   */
  const startContraction = useCallback(() => {
    contractionStartTime.current = Date.now()
    contractionStarted.current = true
    setIsTracking(true)
    logger.debug('useContractionLogic: Contraction started')
  }, [])

  /**
   * End contraction and save
   */
  const endContraction = useCallback((intensity: 'LEVE' | 'MODERADA' | 'FORTE', notes?: string) => {
    if (!contractionStartTime.current || !contractionStarted.current) {
      setError('Contração não foi iniciada')
      return
    }

    const duration = Math.round((Date.now() - contractionStartTime.current) / 1000)

    if (duration < 20) {
      setError('Duração muito curta (mínimo 20s)')
      return
    }

    if (duration > 120) {
      setError('Duração muito longa (máximo 120s)')
      return
    }

    addContraction({ duration, intensity, notes })

    contractionStartTime.current = null
    contractionStarted.current = false
    setIsTracking(false)
  }, [addContraction])

  /**
   * Remove a contraction
   */
  const removeContraction = useCallback((contractionId: string) => {
    setContractions(prev => {
      const updated = prev.filter(c => c.id !== contractionId)
      const newPattern = analyzeContractionPattern(updated)
      setPattern(newPattern)

      logger.debug('useContractionLogic: Contraction removed', {
        contractionCount: updated.length,
      })

      return updated
    })
  }, [])

  /**
   * Clear all contractions
   */
  const clearContractions = useCallback(() => {
    setContractions([])
    setPattern(null)
    logger.debug('useContractionLogic: All contractions cleared')
  }, [])

  /**
   * Get time since last contraction
   */
  const getTimeSinceLastContraction = useCallback((): number | null => {
    if (contractions.length === 0) return null
    const lastContraction = contractions[contractions.length - 1]
    return Math.round((Date.now() - lastContraction.startTime) / 1000)
  }, [contractions])

  /**
   * Get average interval
   */
  const getAverageInterval = useCallback((): number | null => {
    return pattern?.averageInterval || null
  }, [pattern])

  /**
   * Get average duration
   */
  const getAverageDuration = useCallback((): number | null => {
    return pattern?.averageDuration || null
  }, [pattern])

  /**
   * Get contraction count
   */
  const getContractionCount = useCallback((): number => {
    return contractions.length
  }, [contractions])

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setContractions([])
    setPattern(null)
    setIsTracking(false)
    setError(null)
    contractionStartTime.current = null
    contractionStarted.current = false
  }, [])

  return {
    contractions,
    pattern,
    isTracking,
    error,
    setError,

    // Actions
    addContraction,
    startContraction,
    endContraction,
    removeContraction,
    clearContractions,
    reset,

    // Queries
    getTimeSinceLastContraction,
    getAverageInterval,
    getAverageDuration,
    getContractionCount,
  }
}
