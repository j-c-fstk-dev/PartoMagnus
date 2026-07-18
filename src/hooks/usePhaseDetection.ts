/**
 * Custom hook for labor phase detection
 */

import { useState, useEffect, useCallback } from 'react'
import { Contraction, LaborPhase } from '@/types/labor'
import {
  detectLaborPhase,
  shouldGoToHospital,
  estimateTimeToActivePhase,
  estimateProgressPercentage,
  getPhaseRecommendations,
} from '@/utils/algorithms'
import { PhaseAlgorithmService } from '@/services/phaseAlgorithm'
import { logger } from '@/utils/logger'

export interface PhaseAnalysis {
  phase: LaborPhase
  shouldGoToHospital: boolean
  timeToActivePhase: number | null
  progressPercentage: number
  recommendations: string[]
  phaseChanged: boolean
  previousPhase: LaborPhase | null
}

export function usePhaseDetection(
  contractions: Contraction[],
  multiparous: boolean = false,
  riskFactors: boolean = false
) {
  const [phase, setPhase] = useState<LaborPhase>('LATENT')
  const [analysis, setAnalysis] = useState<PhaseAnalysis | null>(null)
  const [phaseChangeNotified, setPhaseChangeNotified] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Perform comprehensive phase analysis
   */
  const analyzePhase = useCallback(() => {
    try {
      if (contractions.length === 0) {
        setPhase('LATENT')
        return
      }

      const newPhase = detectLaborPhase(contractions, false, multiparous)
      const shouldGo = shouldGoToHospital(contractions, multiparous, riskFactors)
      const timeToActive = estimateTimeToActivePhase(contractions, multiparous)
      const progress = estimateProgressPercentage(newPhase)
      const recommendations = getPhaseRecommendations(newPhase)

      const phaseChanged = newPhase !== phase

      const newAnalysis: PhaseAnalysis = {
        phase: newPhase,
        shouldGoToHospital: shouldGo,
        timeToActivePhase: timeToActive,
        progressPercentage: progress,
        recommendations,
        phaseChanged,
        previousPhase: phaseChanged ? phase : null,
      }

      setAnalysis(newAnalysis)
      setPhase(newPhase)

      if (phaseChanged) {
        setPhaseChangeNotified(false)
        logger.info('usePhaseDetection: Phase changed', {
          from: phase,
          to: newPhase,
        })
      }

      setError(null)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMsg)
      logger.error('usePhaseDetection: Analysis failed', err)
    }
  }, [contractions, phase, multiparous, riskFactors])

  /**
   * Run analysis when contractions change
   */
  useEffect(() => {
    analyzePhase()
  }, [analyzePhase])

  /**
   * Check if phase changed and notify
   */
  const notifyPhaseChange = useCallback((): boolean => {
    if (analysis?.phaseChanged && !phaseChangeNotified) {
      setPhaseChangeNotified(true)
      logger.info('usePhaseDetection: Phase change notification sent', {
        newPhase: phase,
      })
      return true
    }
    return false
  }, [analysis?.phaseChanged, phase, phaseChangeNotified])

  /**
   * Get phase duration estimate
   */
  const getPhaseDurationEstimate = useCallback(
    (): { min: number; avg: number; max: number } | null => {
      return PhaseAlgorithmService.getPhaseDurationEstimate(phase)
    },
    [phase]
  )

  /**
   * Check if progressing normally
   */
  const isProgressingNormally = useCallback((): boolean => {
    if (!analysis || contractions.length < 5) return true
    return PhaseAlgorithmService.isProgressingNormally(contractions, analysis as any)
  }, [contractions, analysis])

  /**
   * Get alert status
   */
  const getAlertStatus = useCallback((): 'normal' | 'warning' | 'critical' => {
    return PhaseAlgorithmService.getAlertStatus(contractions, multiparous, riskFactors)
  }, [contractions, multiparous, riskFactors])

  /**
   * Get current phase info
   */
  const getPhaseInfo = useCallback(
    () => ({
      phase,
      analysis,
      durationEstimate: getPhaseDurationEstimate(),
      isProgressing: isProgressingNormally(),
      alertStatus: getAlertStatus(),
    }),
    [phase, analysis, getPhaseDurationEstimate, isProgressingNormally, getAlertStatus]
  )

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setPhase('LATENT')
    setAnalysis(null)
    setPhaseChangeNotified(false)
    setError(null)
  }, [])

  return {
    // State
    phase,
    analysis,
    error,

    // Actions
    analyzePhase,
    notifyPhaseChange,
    reset,

    // Queries
    getPhaseDurationEstimate,
    isProgressingNormally,
    getAlertStatus,
    getPhaseInfo,
  }
}
