import { User } from '@/types/user'

// Export all types from this module
export * from './user'
export * from './labor'
export * from './hospital'
export * from './audio'

// Global app types
export type UUID = string & { readonly __brand: 'UUID' }

export interface AppState {
  isOnboarding: boolean
  isDarkMode: boolean
  isLaboring: boolean
  currentPhase: LaborPhase
  user: User | null
}

export interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

export type LaborPhase = 'PRODROMAL' | 'LATENT' | 'ACTIVE' | 'TRANSITION' | 'EXPULSIVE' | 'COMPLETED'

export interface NotificationPayload {
  title: string
  body: string
  tag?: string
  icon?: string
  badge?: string
}

export interface GeolocationCoords {
  latitude: number
  longitude: number
  accuracy: number
}

export interface RouteInfo {
  distance: number
  duration: number
  polyline?: string
}
