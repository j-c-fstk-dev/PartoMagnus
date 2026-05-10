export type AudioFrequency = 
  | 174
  | 285
  | 396
  | 432
  | 528
  | 639
  | 741
  | 852
  | 963

export type AudioCategory = 
  | 'frequencies'
  | 'breathing_guides'
  | 'affirmations'
  | 'environments'
  | 'background'

export type BreathingType = 
  | 'abdominal'
  | 'horse_lips'
  | 'short_puffs'
  | 'j_breath'
  | 'progressive_relaxation'

export interface AudioFrequencyInfo {
  frequency: AudioFrequency
  name: string
  description: string
  benefits: string[]
  useCase: string
  duration?: number // segundos
}

export interface AudioTrack {
  id: string
  title: string
  description: string
  category: AudioCategory
  frequency?: AudioFrequency
  breathingType?: BreathingType
  duration: number // segundos
  audioUrl: string
  
  // Metadata
  instructor?: string
  language: 'pt-BR' | 'en'
  explicit: boolean
  
  // Recomendações
  recommendedForPhase?: LaborPhase[]
  recommendedIntensity?: ContractionIntensity[]
  
  // Controle
  volume: number // 0-100
  loopable: boolean
  
  createdAt: string
}

export interface Playlist {
  id: string
  name: string
  description: string
  tracks: AudioTrack[]
  category: AudioCategory
  duration: number // total em segundos
  
  // Recomendações
  recommendedForPhase?: LaborPhase[]
  
  // Metadata
  createdBy: string
  isOfficial: boolean
  isCustom: boolean
  
  createdAt: string
  updatedAt: string
}

export interface AudioPlaybackState {
  isPlaying: boolean
  currentTrackId?: string
  currentTime: number // segundos
  duration: number // segundos
  volume: number // 0-100
  isLooping: boolean
  
  playbackRate: number // 0.5 - 2.0
}

export interface GuidedBreathingSession {
  id: string
  type: BreathingType
  duration: number // segundos
  
  phases: BreathingPhase[]
  
  // Audio
  audioUrl?: string
  
  // Instruções
  instructions: string
  visualGuide?: string
  
  createdAt: string
}

export interface BreathingPhase {
  name: string
  inhaleTime: number // segundos
  holdTime: number // segundos
  exhaleTime: number // segundos
  repetitions: number
}

export interface AffirmationTrack extends AudioTrack {
  text: string
  affirmationType: 
    | 'strength'
    | 'safety'
    | 'progress'
    | 'relaxation'
    | 'empowerment'
    | 'motherhood'
  
  voiceType: 'male' | 'female' | 'neutral'
  speed: 'slow' | 'normal' | 'fast'
}

export interface EnvironmentSound extends AudioTrack {
  environmentType: 
    | 'rain'
    | 'forest'
    | 'ocean'
    | 'tibetan_bowl'
    | 'birds'
    | 'meditation'
    | 'nature'
  
  ambientVolume: number // 0-100
  loopDuration: number // segundos
}

export interface AudioSettings {
  id: string
  userId: string
  
  // Preferências gerais
  audioEnabled: boolean
  vibrationEnabled: boolean
  masterVolume: number // 0-100
  
  // Por categoria
  frequencyVolume: number
  breathingGuideVolume: number
  affirmationVolume: number
  environmentVolume: number
  
  // Comportamento
  autoPlayAffirmations: boolean
  autoPlayBreathingGuides: boolean
  backgroundSoundEnabled: boolean
  
  // Notificações
  soundNotifications: boolean
  
  createdAt: string
  updatedAt: string
}

export interface FrequencyTherapy {
  id: string
  frequency: AudioFrequency
  duration: number // minutos
  
  benefits: string[]
  scientificBasis?: string
  
  recommendedFor: {
    phase?: LaborPhase
    purpose: 'pain_relief' | 'relaxation' | 'focus' | 'healing' | 'empowerment'
  }
  
  audioUrl: string
  createdAt: string
}

// Type guards
export type LaborPhase = 'LATENT' | 'ACTIVE' | 'TRANSITION' | 'EXPULSIVE'
export type ContractionIntensity = 'LEVE' | 'MODERADA' | 'FORTE'
