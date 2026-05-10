export type LaborPhase = 'PRODROMAL' | 'LATENT' | 'ACTIVE' | 'TRANSITION' | 'EXPULSIVE' | 'DEQUITACAO' | 'COMPLETED'

export type ContractionIntensity = 'LEVE' | 'MODERADA' | 'FORTE'

export type AlertLevel = 'GREEN' | 'YELLOW' | 'RED'

export interface Contraction {
  id: string
  sessionId: string
  startTime: number // timestamp
  endTime?: number
  duration: number // segundos
  interval?: number // segundos desde a contração anterior
  intensity: ContractionIntensity
  notes?: string
  createdAt: string
}

export interface ContractionPattern {
  averageInterval: number // segundos
  averageDuration: number // segundos
  regularityScore: number // 0-1
  intensityTrend: 'increasing' | 'stable' | 'decreasing'
  estimatedPhase: LaborPhase
  confidence: number // 0-1
}

export interface LaborSession {
  id: string
  userId: string
  startTime: string // ISO timestamp
  endTime?: string
  
  // Fases e duração
  phases: {
    prodromal?: { startTime: string; endTime?: string; duration?: number }
    latent?: { startTime: string; endTime?: string; duration?: number }
    active?: { startTime: string; endTime?: string; duration?: number }
    transition?: { startTime: string; endTime?: string; duration?: number }
    expulsive?: { startTime: string; endTime?: string; duration?: number }
  }
  
  // Contrações
  contractions: Contraction[]
  currentPattern: ContractionPattern
  
  // Desfecho
  outcome?: 'vaginal' | 'cesarean' | 'vac_extraction' | 'forceps' | 'not_completed'
  deliveryTime?: string
  babyWeight?: number // gramas
  babyHeight?: number // centímetros
  babyApgar?: { one: number; five: number; ten?: number }
  
  // Saúde materna pós-parto
  postPartumStatus?: 'good' | 'fair' | 'complications'
  postPartumNotes?: string
  
  // Anamnese durante trabalho de parto
  anamnesisRecords: AnamnesisRecord[]
  
  // Localização
  location?: {
    latitude: number
    longitude: number
    hospitalName?: string
  }
  
  // Rating e notas
  userRating?: number // 1-5
  userNotes?: string
  
  // Metadata
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export interface AnamnesisRecord {
  id: string
  sessionId: string
  timestamp: string
  
  // Movimentação fetal
  fetalMovement: 'normal' | 'reduced' | 'absent'
  
  // Fluidos
  fluidLoss: 'none' | 'clear' | 'green' | 'yellow' | 'dark' | 'bloody'
  fluidAmount?: 'small' | 'moderate' | 'large'
  
  // Sangramento
  vaginalBleeding: boolean
  bleedingAmount?: 'small' | 'moderate' | 'large'
  
  // Dor abdominal
  abdominalPainBetweenContractions: boolean
  painIntensity?: 'mild' | 'moderate' | 'severe'
  painConstant: boolean
  
  // Febre
  hasChillsOrFever: boolean
  temperature?: number
  
  // Tontura
  hasDizzinessOrFainting: boolean
  
  // Visão
  hasBlurredOrDarkVision: boolean
  
  // Geral
  generalObservations?: string
  
  // Sistema de alertas
  alertLevel: AlertLevel
  requiresHospitalization: boolean
  
  createdAt: string
}

export interface LaborAlert {
  id: string
  sessionId: string
  timestamp: string
  alertLevel: AlertLevel
  type: 'fetal_distress' | 'maternal_bleeding' | 'fever' | 'severe_pain' | 'no_progress' | 'other'
  description: string
  actionTaken?: string
  resolvedAt?: string
}

export interface PositionRecommendation {
  name: 'caminhada' | 'bola_suica' | 'gatas' | 'cocoras' | 'walcher' | 'lateral' | 'em_pe'
  benefits: string[]
  whenToUse: string
  contraindications?: string[]
  instructions: string
}

export interface BreathingTechnique {
  id: string
  name: string
  description: string
  duration: number // segundos
  technique: 'abdominal' | 'horse_lips' | 'short_puffs' | 'j_breath' | 'relaxation'
  audioUrl?: string
  forPhase: LaborPhase[]
}

export interface LaborStats {
  totalContractions: number
  totalDuration: number // minutos
  averageInterval: number // minutos
  averageDuration: number // segundos
  
  phaseBreakdown: {
    phase: LaborPhase
    duration: number // minutos
    contractionCount: number
  }[]
  
  peakIntensityTime: string
  estimatedProgressPercentage: number // 0-100
}
