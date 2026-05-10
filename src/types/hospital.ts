export interface Hospital {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  website?: string
  
  // Localização
  coordinates: {
    latitude: number
    longitude: number
  }
  
  // Serviços
  services: HospitalService[]
  
  // Recursos obstétricos
  hasVaginalDelivery: boolean
  hasCesareanSection: boolean
  hasContinuousLabor: boolean
  hasDoula: boolean
  hasBirthing: boolean
  hasEpidural: boolean
  hasMothersRooming: boolean
  
  // Humanização
  hasHumanizedBirthProgram: boolean
  allowsCompanion: boolean
  allowsMultipleBirthPositions: boolean
  allowsFreeMovement: boolean
  
  // Avaliação
  rating: number // 1-5
  totalReviews: number
  
  // Tipos de atendimento
  acceptsPublicHealth: boolean
  acceptsPrivateInsurance: boolean
  acceptsPrivatePay: boolean
  
  createdAt: string
  updatedAt: string
}

export type HospitalService = 
  | 'obstetrics' 
  | 'neonatal_icu' 
  | 'pediatrics' 
  | 'anesthesia' 
  | 'ultrasound' 
  | 'blood_bank' 
  | 'emergency'

export interface NearbyHospital extends Hospital {
  distance: number // km
  estimatedTime: number // minutos
  route?: RouteInfo
}

export interface RouteInfo {
  distance: number // km
  duration: number // minutos
  polyline?: string // Google Maps polyline encoding
}

export interface HospitalContact {
  id: string
  hospitalId: string
  
  // Contatos principais
  mainPhone: string
  emergencyPhone: string
  obstetricDepartmentPhone?: string
  
  // Pessoas
  directorName?: string
  chefObstetricianName?: string
  
  // Horários
  visitingHours: {
    start: string // HH:mm
    end: string // HH:mm
  }
  
  // Políticas
  companionPolicy: string
  visitorPolicy: string
  parkingInfo?: string
  
  createdAt: string
  updatedAt: string
}

export interface HospitalReview {
  id: string
  hospitalId: string
  userId: string
  
  rating: number // 1-5
  title: string
  content: string
  
  // Aspectos
  cleanliness: number
  professionalism: number
  compassion: number
  facilities: number
  
  birthOutcome: 'vaginal' | 'cesarean' | 'assisted'
  wouldRecommend: boolean
  
  createdAt: string
}

export interface BirthCenter {
  id: string
  name: string
  address: string
  city: string
  coordinates: {
    latitude: number
    longitude: number
  }
  phone: string
  
  midwives: number
  doulas: number
  
  hasLaborBed: boolean
  hasBirthBall: boolean
  hasShower: boolean
  hasWaterBirth: boolean
  
  distanceToCesarean: number // km
  
  rating: number
  totalReviews: number
  
  createdAt: string
  updatedAt: string
}
