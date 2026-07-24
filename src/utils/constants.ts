// App metadata
export const APP_NAME = 'Parto Magnus'
export const APP_VERSION = '0.1.0'
export const APP_DESCRIPTION = 'App de acompanhamento de parto baseado em evidências clínicas'

// Labor phase constants
export const LABOR_PHASES = {
  PRODROMAL: 'PRODROMAL',
  LATENT: 'LATENT',
  ACTIVE: 'ACTIVE',
  TRANSITION: 'TRANSITION',
  EXPULSIVE: 'EXPULSIVE',
  DEQUITACAO: 'DEQUITACAO',
  COMPLETED: 'COMPLETED',
} as const

// Alert levels
export const ALERT_LEVELS = {
  GREEN: 'GREEN',
  YELLOW: 'YELLOW',
  RED: 'RED',
} as const

// Contraction intensity levels
export const CONTRACTION_INTENSITY = {
  LEVE: 'LEVE',
  MODERADA: 'MODERADA',
  FORTE: 'FORTE',
} as const

// Labor diagnosis rules (5-1-1 for primigravida, 4-1-1 for multigravida)
export const LABOR_DIAGNOSIS = {
  PRIMIGRAVIDA: {
    interval: 5 * 60, // 5 minutes in seconds
    duration: 60, // 1 minute in seconds
    minDurationMinutes: 60, // 1 hour
    name: '5-1-1 Rule',
  },
  MULTIGRAVIDA: {
    interval: 7 * 60, // 7 minutes in seconds
    duration: 60, // 1 minute in seconds
    minDurationMinutes: 45,
    name: '7-1-1 Rule',
  },
} as const

// Contraction patterns (in seconds)
export const CONTRACTION_PATTERNS = {
  MIN_DURATION: 20,
  MAX_DURATION: 120,
  MIN_INTERVAL: 60, // 1 minute
  MAX_INTERVAL: 30 * 60, // 30 minutes
  NORMAL_LATENT_INTERVAL: 10 * 60, // 10 minutes
  NORMAL_ACTIVE_INTERVAL: 5 * 60, // 5 minutes
  NORMAL_TRANSITION_INTERVAL: 2 * 60, // 2 minutes
} as const

// Phase durations (in hours) - averages
export const PHASE_DURATIONS = {
  PRODROMAL: { min: 0.5, avg: 2, max: 8 },
  LATENT: { min: 2, avg: 8, max: 20 },
  ACTIVE: { min: 2, avg: 5, max: 12 },
  TRANSITION: { min: 0.5, avg: 1, max: 3 },
  EXPULSIVE: { min: 0.25, avg: 1, max: 3 },
  DEQUITACAO: { min: 0.083, avg: 0.5, max: 1 }, // max 1 hour
} as const

// Solfeggio frequencies (Hz)
export const SOLFEGGIO_FREQUENCIES = {
  174: { name: 'Pain Relief', benefit: 'Alívio de dor e feridas' },
  285: { name: 'Tissue Regeneration', benefit: 'Regeneração de tecidos' },
  396: { name: 'Guilt & Fear', benefit: 'Liberação de culpa e medo' },
  432: { name: 'Healing Tone', benefit: 'Tom de cura (afinação Stradivarius)' },
  528: { name: 'DNA Repair', benefit: 'Reparação de DNA' },
  639: { name: 'Emotional Healing', benefit: 'Cura emocional e relacionamentos' },
  741: { name: 'Intuition', benefit: 'Intuição e despertar' },
  852: { name: 'Spiritual Order', benefit: 'Retorno à ordem espiritual' },
  963: { name: 'Divine Consciousness', benefit: 'Elevação de consciência' },
} as const

// Colors - Dark Mode
export const COLORS = {
  dark: {
    950: '#0a0e27',
    900: '#0f172a',
    800: '#1f2937',
    700: '#374151',
    600: '#4b5563',
    500: '#6b7280',
  },
  primary: {
    600: '#9333ea',
    500: '#a855f7',
  },
  secondary: {
    600: '#0891b2',
    500: '#06b6d4',
  },
  accent: {
    600: '#db2777',
    500: '#ec4899',
  },
  success: '#51cf66',
  warning: '#ffa94d',
  error: '#ff7d7d',
} as const

// Storage keys
export const STORAGE_KEYS = {
  USER: 'partomagnus:user',
  ANAMNESIS: 'partomagnus:anamnesis',
  LABOR_SESSION: 'partomagnus:labor_session',
  CONTRACTIONS: 'partomagnus:contractions',
  USER_PREFERENCES: 'partomagnus:preferences',
  AUDIO_SETTINGS: 'partomagnus:audio_settings',
  APP_STATE: 'partomagnus:app_state',
  LABOR_SESSIONS_HISTORY: 'partomagnus:labor_history',
  TIMESTAMP: 'partomagnus:timestamp',
} as const

// Time constants
export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
} as const

// Geolocation - Pindamonhangaba hospitals
export const PINDAMONHANGABA_CENTER = {
  latitude: -22.3186,
  longitude: -45.4686,
} as const

export const DEFAULT_LOCATION_RADIUS = 20 // km

// Pregnancy
export const PREGNANCY = {
  MIN_VIABILITY_WEEKS: 22,
  TERM_START_WEEKS: 37,
  TERM_END_WEEKS: 42,
  AVERAGE_GESTATIONAL_WEEKS: 40,
  DUE_DATE_VARIATION_DAYS: 7, // +/- 7 days is normal
} as const

// Validation
export const VALIDATION = {
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MIN_PHONE_LENGTH: 10,
  MAX_PHONE_LENGTH: 20,
  WEEKS_MIN: 0,
  WEEKS_MAX: 43,
} as const

// API endpoints (if using backend later)
export const API_ENDPOINTS = {
  BASE_URL: import.meta.env.VITE_API_URL || '',
  HEALTH: '/health',
  USERS: '/users',
  LABOR_SESSIONS: '/labor-sessions',
  HOSPITALS: '/hospitals',
} as const

// Breathing techniques
export const BREATHING_TECHNIQUES = {
  ABDOMINAL: 'abdominal',
  HORSE_LIPS: 'horse_lips',
  SHORT_PUFFS: 'short_puffs',
  J_BREATH: 'j_breath',
  PROGRESSIVE_RELAXATION: 'progressive_relaxation',
} as const

// Positions for labor
export const LABOR_POSITIONS = {
  WALKING: 'walking',
  BIRTH_BALL: 'birth_ball',
  QUADRUPED: 'quadruped',
  SQUAT: 'squat',
  WALCHER: 'walcher',
  LATERAL: 'lateral',
  STANDING: 'standing',
} as const

// Push notification tags
export const NOTIFICATION_TAGS = {
  PHASE_CHANGE: 'phase_change',
  MILESTONE: 'milestone',
  AFFIRMATION: 'affirmation',
  HYDRATION_REMINDER: 'hydration_reminder',
  MOVEMENT_REMINDER: 'movement_reminder',
  ALERT: 'alert',
  EMERGENCY: 'emergency',
} as const

// Feature flags (for future use)
export const FEATURES = {
  PUSH_NOTIFICATIONS_ENABLED: true,
  OFFLINE_MODE_ENABLED: true,
  VIBRATION_ENABLED: true,
  VIDEO_GUIDES_ENABLED: false,
  DOCTOR_SHARE_ENABLED: false,
  PREMIUM_FEATURES_ENABLED: false,
} as const
