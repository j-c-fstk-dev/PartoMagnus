/**
 * Algorithms for labor tracking and analysis
 */

import { Contraction, ContractionPattern, LaborPhase } from '@/types/labor'
import { LABOR_DIAGNOSIS, LABOR_PHASES } from './constants'

// ============ PHASE DETECTION ============

export function detectLaborPhase(
  contractions: Contraction[],
  userReportsPushing: boolean = false,
  multiparous: boolean = false
): LaborPhase {
  if (userReportsPushing) {
    return LABOR_PHASES.EXPULSIVE
  }

  if (contractions.length < 3) {
    return LABOR_PHASES.PRODROMAL
  }

  const recentContractions = contractions.slice(-20) // Last 20 contractions
  const pattern = analyzeContractionPattern(recentContractions)

  // Transition phase detection (very frequent contractions)
  if (pattern.averageInterval <= 2 * 60 && pattern.averageDuration >= 45) {
    return LABOR_PHASES.TRANSITION
  }

  // Active phase detection
  const activeDiagnosis = multiparous
    ? LABOR_DIAGNOSIS.MULTIGRAVIDA
    : LABOR_DIAGNOSIS.PRIMIGRAVIDA

  if (
    pattern.averageInterval <= activeDiagnosis.interval &&
    pattern.averageDuration >= activeDiagnosis.duration &&
    pattern.regularityScore >= 0.8
  ) {
    return LABOR_PHASES.ACTIVE
  }

  // Latent phase detection
  if (
    pattern.averageInterval <= 10 * 60 &&
    pattern.regularityScore >= 0.6 &&
    pattern.averageDuration >= 30
  ) {
    return LABOR_PHASES.LATENT
  }

  // Default to prodromal
  return LABOR_PHASES.PRODROMAL
}

// ============ PATTERN ANALYSIS ============

export function analyzeContractionPattern(contractions: Contraction[]): ContractionPattern {
  if (contractions.length === 0) {
    return {
      averageInterval: 0,
      averageDuration: 0,
      regularityScore: 0,
      intensityTrend: 'stable',
      estimatedPhase: LABOR_PHASES.PRODROMAL,
      confidence: 0,
    }
  }

  // Calculate intervals
  const intervals: number[] = []
  for (let i = 1; i < contractions.length; i++) {
    const interval = contractions[i].startTime - contractions[i - 1].startTime
    intervals.push(interval)
  }

  const averageInterval = intervals.length > 0 ? intervals.reduce((a, b) => a + b, 0) / intervals.length : 0
  const averageDuration = contractions.reduce((sum, c) => sum + c.duration, 0) / contractions.length

  // Regularity score (0-1): how consistent are the intervals?
  const regularityScore = calculateRegularityScore(intervals)

  // Intensity trend
  const intensityTrend = calculateIntensityTrend(contractions)

  // Estimate phase
  const estimatedPhase = detectLaborPhase(contractions)

  // Confidence based on number of data points
  const confidence = Math.min(contractions.length / 20, 1)

  return {
    averageInterval,
    averageDuration,
    regularityScore,
    intensityTrend,
    estimatedPhase,
    confidence,
  }
}

function calculateRegularityScore(intervals: number[]): number {
  if (intervals.length < 2) return 0

  // Calculate coefficient of variation
  const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length
  const variance = intervals.reduce((sum, interval) => sum + Math.pow(interval - mean, 2), 0) / intervals.length
  const stdDev = Math.sqrt(variance)
  const coefficientOfVariation = stdDev / mean

  // Convert CV to regularity score (0-1, where 1 is perfectly regular)
  // CV of 0 = perfectly regular (score 1)
  // CV of 0.5 = 50% variation (score 0.5)
  return Math.max(0, 1 - coefficientOfVariation)
}

function calculateIntensityTrend(contractions: Contraction[]): 'increasing' | 'stable' | 'decreasing' {
  if (contractions.length < 3) return 'stable'

  const recent = contractions.slice(-5)
  const intensityValues = recent.map(c => {
    switch (c.intensity) {
      case 'LEVE':
        return 1
      case 'MODERADA':
        return 2
      case 'FORTE':
        return 3
      default:
        return 0
    }
  })

  const firstHalf = intensityValues.slice(0, Math.floor(intensityValues.length / 2))
  const secondHalf = intensityValues.slice(Math.floor(intensityValues.length / 2))

  const firstAvg = firstHalf.reduce((a: number, b: number) => a + b, 0) / firstHalf.length
  const secondAvg = secondHalf.reduce((a: number, b: number) => a + b, 0) / secondHalf.length

  const diff = secondAvg - firstAvg

  if (diff > 0.5) return 'increasing'
  if (diff < -0.5) return 'decreasing'
  return 'stable'
}

// ============ DIAGNOSIS ============

export function shouldGoToHospital(
  contractions: Contraction[],
  multiparous: boolean = false,
  riskFactors: boolean = false
): boolean {
  if (contractions.length < 3) return false

  const pattern = analyzeContractionPattern(contractions)
  const diagnosis = multiparous ? LABOR_DIAGNOSIS.MULTIGRAVIDA : LABOR_DIAGNOSIS.PRIMIGRAVIDA

  // If risk factors, more conservative approach
  if (riskFactors) {
    return (
      pattern.averageInterval <= diagnosis.interval + 60 && // 1 min more lenient
      pattern.averageDuration >= diagnosis.duration &&
      pattern.regularityScore >= 0.7
    )
  }

  return (
    pattern.averageInterval <= diagnosis.interval &&
    pattern.averageDuration >= diagnosis.duration &&
    pattern.regularityScore >= 0.8
  )
}

export function estimateTimeToActivePhase(
  contractions: Contraction[],
  multiparous: boolean = false
): number | null {
  if (contractions.length < 3) return null

  const pattern = analyzeContractionPattern(contractions)

  if (pattern.estimatedPhase === LABOR_PHASES.ACTIVE || pattern.estimatedPhase === LABOR_PHASES.TRANSITION) {
    return 0 // Already in active phase
  }

  if (pattern.estimatedPhase === LABOR_PHASES.PRODROMAL) {
    return null // Too early to estimate
  }

  // If in latent phase, estimate based on progression rate
  const diagnosis = multiparous ? LABOR_DIAGNOSIS.MULTIGRAVIDA : LABOR_DIAGNOSIS.PRIMIGRAVIDA
  const intervalsToGo = Math.ceil(
    (diagnosis.interval - pattern.averageInterval) / (pattern.averageInterval * 0.05)
  )

  if (intervalsToGo < 0) return 0

  const estimatedMinutes = (intervalsToGo * pattern.averageInterval) / 60
  return Math.round(estimatedMinutes)
}

// ============ PROGRESS ESTIMATION ============

export function estimateProgressPercentage(phase: LaborPhase): number {
  const phaseProgress: Record<LaborPhase, number> = {
    [LABOR_PHASES.PRODROMAL]: 5,
    [LABOR_PHASES.LATENT]: 25,
    [LABOR_PHASES.ACTIVE]: 50,
    [LABOR_PHASES.TRANSITION]: 85,
    [LABOR_PHASES.EXPULSIVE]: 95,
    [LABOR_PHASES.DEQUITACAO]: 98,
    [LABOR_PHASES.COMPLETED]: 100,
  }
  return phaseProgress[phase] || 0
}

// ============ STATISTICS ============

export function calculateContractionStats(contractions: Contraction[]) {
  if (contractions.length === 0) {
    return {
      totalContractions: 0,
      totalDuration: 0,
      averageInterval: 0,
      averageDuration: 0,
      longestContraction: 0,
      shortestContraction: 0,
    }
  }

  const intervals: number[] = []
  let totalDuration = 0

  for (let i = 0; i < contractions.length; i++) {
    totalDuration += contractions[i].duration

    if (i > 0) {
      const interval = contractions[i].startTime - contractions[i - 1].startTime
      intervals.push(interval)
    }
  }

  const averageInterval = intervals.length > 0 ? intervals.reduce((a, b) => a + b, 0) / intervals.length : 0
  const averageDuration = totalDuration / contractions.length
  const durations = contractions.map(c => c.duration)
  const longestContraction = Math.max(...durations)
  const shortestContraction = Math.min(...durations)

  return {
    totalContractions: contractions.length,
    totalDuration: totalDuration,
    averageInterval,
    averageDuration,
    longestContraction,
    shortestContraction,
  }
}

// ============ VALIDATION ============

export function isAnomalousContraction(contraction: Contraction, pattern: ContractionPattern): boolean {
  // Check if this contraction is significantly different from the pattern
  const durationDiff = Math.abs(contraction.duration - pattern.averageDuration)
  const durationStdDev = pattern.averageDuration * 0.3 // Assume 30% std dev

  return durationDiff > durationStdDev * 2 // 2 standard deviations
}

// ============ RECOMMENDATIONS ============

export function getPhaseRecommendations(phase: LaborPhase): string[] {
  const recommendations: Record<LaborPhase, string[]> = {
    [LABOR_PHASES.PRODROMAL]: [
      'Descanse e mantenha a rotina',
      'Hidratação adequada',
      'Caminhe um pouco',
      'Não vá para o hospital ainda',
    ],
    [LABOR_PHASES.LATENT]: [
      'Continue descansando',
      'Alimentação leve e hidratação',
      'Movimentação e caminhas',
      'Técnicas de relaxamento',
      'Distração com atividades',
    ],
    [LABOR_PHASES.ACTIVE]: [
      'Vá para o hospital se ainda não foi',
      'Use técnicas de respiração',
      'Mude de posição frequentemente',
      'Peça apoio do acompanhante',
      'Hidratação contínua',
    ],
    [LABOR_PHASES.TRANSITION]: [
      'Você está perto!',
      'Foco em respiração e relaxamento',
      'Apoio emocional do acompanhante',
      'Lembre-se: esta fase é a mais curta',
      'Seu bebê está chegando',
    ],
    [LABOR_PHASES.EXPULSIVE]: [
      'Siga os impulsos do seu corpo',
      'Empurre quando sentir vontade',
      'Use posições verticais se possível',
      'Respire lentamente entre puxos',
      'Seu bebê está nascendo!',
    ],
    [LABOR_PHASES.DEQUITACAO]: [
      'Placenta será expulsa em até 30 min',
      'Continue respirando',
      'Contato pele a pele com bebê',
      'Equipe monitorará progresso',
    ],
    [LABOR_PHASES.COMPLETED]: [
      '🎉 Parabéns! Seu bebê nasceu!',
      'Tempo para descanso e recuperação',
      'Contato pele a pele',
      'Primeira amamentação',
    ],
  }
  return recommendations[phase] || []
}
