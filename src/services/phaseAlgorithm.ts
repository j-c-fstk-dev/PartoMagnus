/**
 * Phase detection algorithm service
 * Core logic for detecting labor phases
 */

import { Contraction, ContractionPattern, LaborPhase } from '@/types/labor'
import {
  detectLaborPhase,
  analyzeContractionPattern,
  shouldGoToHospital,
  estimateTimeToActivePhase,
  estimateProgressPercentage,
  calculateContractionStats,
  getPhaseRecommendations,
} from '@/utils/algorithms'
import { logger } from '@/utils/logger'

export class PhaseAlgorithmService {
  /**
   * Detect current labor phase from contractions
   */
  static detectPhase(
    contractions: Contraction[],
    userReportsPushing: boolean = false,
    multiparous: boolean = false
  ): LaborPhase {
    logger.debug('PhaseAlgorithmService: Detecting phase', {
      contractionCount: contractions.length,
      pushing: userReportsPushing,
    })

    return detectLaborPhase(contractions, userReportsPushing, multiparous)
  }

  /**
   * Analyze contraction pattern
   */
  static analyzePattern(contractions: Contraction[]): ContractionPattern {
    logger.debug('PhaseAlgorithmService: Analyzing pattern', {
      contractionCount: contractions.length,
    })

    return analyzeContractionPattern(contractions)
  }

  /**
   * Determine if user should go to hospital
   */
  static shouldGoToHospital(
    contractions: Contraction[],
    multiparous: boolean = false,
    riskFactors: boolean = false
  ): boolean {
    const result = shouldGoToHospital(contractions, multiparous, riskFactors)

    logger.info('PhaseAlgorithmService: Hospital recommendation', {
      shouldGo: result,
      contractionCount: contractions.length,
      multiparous,
      riskFactors,
    })

    return result
  }

  /**
   * Estimate time to active phase
   */
  static estimateTimeToActivePhase(
    contractions: Contraction[],
    multiparous: boolean = false
  ): number | null {
    const estimate = estimateTimeToActivePhase(contractions, multiparous)

    logger.debug('PhaseAlgorithmService: Time to active phase estimated', {
      minutes: estimate,
    })

    return estimate
  }

  /**
   * Get progress percentage for current phase
   */
  static getProgressPercentage(phase: LaborPhase): number {
    return estimateProgressPercentage(phase)
  }

  /**
   * Get contraction statistics
   */
  static getStats(contractions: Contraction[]) {
    return calculateContractionStats(contractions)
  }

  /**
   * Get recommendations for current phase
   */
  static getRecommendations(phase: LaborPhase): string[] {
    return getPhaseRecommendations(phase)
  }

  /**
   * Comprehensive phase analysis
   */
  static comprehensiveAnalysis(
    contractions: Contraction[],
    multiparous: boolean = false,
    userReportsPushing: boolean = false
  ) {
    const phase = this.detectPhase(contractions, userReportsPushing, multiparous)
    const pattern = this.analyzePattern(contractions)
    const shouldGo = this.shouldGoToHospital(contractions, multiparous)
    const timeToActive = this.estimateTimeToActivePhase(contractions, multiparous)
    const progress = this.getProgressPercentage(phase)
    const stats = this.getStats(contractions)
    const recommendations = this.getRecommendations(phase)

    logger.debug('PhaseAlgorithmService: Comprehensive analysis complete', {
      phase,
      shouldGoToHospital: shouldGo,
      progressPercentage: progress,
    })

    return {
      phase,
      pattern,
      shouldGoToHospital: shouldGo,
      timeToActivePhase: timeToActive,
      progressPercentage: progress,
      stats,
      recommendations,
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * Detect phase changes
   */
  static detectPhaseChange(
    previousPhase: LaborPhase,
    contractions: Contraction[],
    multiparous: boolean = false
  ): { changed: boolean; newPhase?: LaborPhase } {
    const newPhase = this.detectPhase(contractions, false, multiparous)

    const changed = newPhase !== previousPhase

    if (changed) {
      logger.info('PhaseAlgorithmService: Phase change detected', {
        from: previousPhase,
        to: newPhase,
      })
    }

    return {
      changed,
      newPhase: changed ? newPhase : undefined,
    }
  }

  /**
   * Get phase duration estimate
   */
  static getPhaseDurationEstimate(phase: LaborPhase): { min: number; avg: number; max: number } | null {
    const durations: Record<LaborPhase, { min: number; avg: number; max: number }> = {
      PRODROMAL: { min: 0.5, avg: 2, max: 8 },
      LATENT: { min: 2, avg: 8, max: 20 },
      ACTIVE: { min: 2, avg: 5, max: 12 },
      TRANSITION: { min: 0.5, avg: 1, max: 3 },
      EXPULSIVE: { min: 0.25, avg: 1, max: 3 },
      DEQUITACAO: { min: 0.083, avg: 0.5, max: 1 },
      COMPLETED: { min: 0, avg: 0, max: 0 },
    }

    return durations[phase] || null
  }

  /**
   * Check if contractions are progressing normally
   */
  static isProgressingNormally(
    contractions: Contraction[],
    previousPattern: ContractionPattern | null
  ): boolean {
    if (!previousPattern || contractions.length < 5) return true

    const currentPattern = this.analyzePattern(contractions)

    // Contractions should be getting more regular and frequent
    const regularityImproving = currentPattern.regularityScore >= previousPattern.regularityScore * 0.9
    const frequencyIncreasing = currentPattern.averageInterval <= previousPattern.averageInterval * 1.1

    return regularityImproving && frequencyIncreasing
  }

  /**
   * Get alert status based on pattern
   */
  static getAlertStatus(
    contractions: Contraction[],
    multiparous: boolean = false,
    riskFactors: boolean = false
  ): 'normal' | 'warning' | 'critical' {
    const pattern = this.analyzePattern(contractions)

    // If no progress in 2+ hours, warning
    if (contractions.length > 0 && contractions.length < 5) {
      return 'normal'
    }

    // If pattern shows concerning trend
    if (pattern.intensityTrend === 'decreasing' && contractions.length > 10) {
      return 'warning'
    }

    // If should have gone to hospital already
    if (this.shouldGoToHospital(contractions, multiparous, riskFactors) && !riskFactors) {
      return 'warning'
    }

    return 'normal'
  }
}
