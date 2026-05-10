export interface User {
  id: string
  name: string
  birthDate: string
  email?: string
  phone?: string
  createdAt: string
  updatedAt: string
}

export interface Anamnesis {
  id: string
  userId: string
  
  // Gestação atual
  currentWeek: number
  estimatedDueDate: string
  
  // Histórico obstétrico
  numberOfPreviousPregnancies: number
  numberOfNormalBirths: number
  numberOfCesareans: number
  numberOfMiscarriages: number
  
  // Última gravidez
  lastPregnancyOutcome?: 'normal' | 'cesarean' | 'miscarriage' | 'stillbirth'
  
  // Dados do bebê atual
  babyIsHeadDown: boolean | null
  lastUltrasoundDate?: string
  lastUltrasoundNormal: boolean | null
  
  // CTG (Cardiotocografia)
  hadCTG: boolean
  ctgResult?: 'normal' | 'altered'
  
  // Fatores de risco
  hasHighBloodPressure: boolean
  hasGestationalDiabetes: boolean
  hasHIV: boolean
  hasHepatitis: boolean
  hasGroupBStreptococcus: boolean
  hasUterineScar: boolean // cesárea anterior
  
  // Preferências
  preferredBirthLocation: 'hospital_1' | 'hospital_2' | 'birthing_center' | 'home' | 'other'
  preferredHospital?: string
  
  // Acompanhante
  hasCompanion: boolean
  companionName?: string
  companionRelationship?: 'partner' | 'mother' | 'friend' | 'doula' | 'other'
  
  // Notificações
  wantsPushNotifications: boolean
  wantsToShareWithDoctor: boolean
  
  // Metadata
  riskLevel: 'low' | 'medium' | 'high'
  createdAt: string
  updatedAt: string
}

export interface UserPreferences {
  id: string
  userId: string
  
  // UI
  darkMode: boolean
  fontSize: 'small' | 'medium' | 'large'
  language: 'pt-BR' | 'en' | 'es'
  
  // Audio
  soundEnabled: boolean
  vibrationEnabled: boolean
  volumeLevel: number // 0-100
  
  // Notifications
  pushNotificationsEnabled: boolean
  pushFrequency: 'always' | 'hourly' | 'never'
  
  // Privacy
  dataStorageLocal: boolean
  allowAnalytics: boolean
  
  createdAt: string
  updatedAt: string
}

export interface UserSession {
  userId: string
  sessionStart: string
  lastActivity: string
  isActive: boolean
}
