/**
 * User state store (Zustand)
 * Manages user profile and anamnesis data
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { User, Anamnesis, UserPreferences } from '@/types/user'
import { STORAGE_KEYS } from '@/utils/constants'

export interface UserState {
  // User data
  user: User | null
  anamnesis: Anamnesis | null
  preferences: UserPreferences | null
  
  // Loading states
  isLoading: boolean
  error: string | null
  
  // Actions
  setUser: (user: User | null) => void
  setAnamnesis: (anamnesis: Anamnesis | null) => void
  setPreferences: (preferences: UserPreferences | null) => void
  updateUser: (updates: Partial<User>) => void
  updateAnamnesis: (updates: Partial<Anamnesis>) => void
  updatePreferences: (updates: Partial<UserPreferences>) => void
  
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  
  // Queries
  isFirstTime: () => boolean
  hasCompletedAnamnesis: () => boolean
  getRiskLevel: () => 'low' | 'medium' | 'high' | null
  
  // Reset
  clearUser: () => void
  reset: () => void
}

const initialState = {
  user: null,
  anamnesis: null,
  preferences: null,
  isLoading: false,
  error: null,
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setUser: (user: User | null) => {
          set({ user })
        },

        setAnamnesis: (anamnesis: Anamnesis | null) => {
          set({ anamnesis })
        },

        setPreferences: (preferences: UserPreferences | null) => {
          set({ preferences })
        },

        updateUser: (updates: Partial<User>) => {
          const current = get().user
          if (!current) return
          
          const updated = {
            ...current,
            ...updates,
            updatedAt: new Date().toISOString(),
          }
          set({ user: updated })
        },

        updateAnamnesis: (updates: Partial<Anamnesis>) => {
          const current = get().anamnesis
          if (!current) return
          
          const updated = {
            ...current,
            ...updates,
            updatedAt: new Date().toISOString(),
          }
          set({ anamnesis: updated })
        },

        updatePreferences: (updates: Partial<UserPreferences>) => {
          const current = get().preferences
          if (!current) return
          
          const updated = {
            ...current,
            ...updates,
            updatedAt: new Date().toISOString(),
          }
          set({ preferences: updated })
        },

        setLoading: (isLoading: boolean) => {
          set({ isLoading })
        },

        setError: (error: string | null) => {
          set({ error })
        },

        isFirstTime: () => {
          return get().user === null
        },

        hasCompletedAnamnesis: () => {
          return get().anamnesis !== null
        },

        getRiskLevel: () => {
          const anamnesis = get().anamnesis
          if (!anamnesis) return null
          return anamnesis.riskLevel
        },

        clearUser: () => {
          set({
            user: null,
            anamnesis: null,
            preferences: null,
          })
        },

        reset: () => {
          set(initialState)
        },
      }),
      {
        name: STORAGE_KEYS.USER,
        version: 1,
      }
    )
  )
)
