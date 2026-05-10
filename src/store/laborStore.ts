/**
 * Labor tracking state store (Zustand)
 * Manages labor session, contractions, and monitoring data
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { LaborSession, Contraction, AnamnesisRecord, LaborAlert, ContractionPattern } from '@/types/labor'
import { STORAGE_KEYS } from '@/utils/constants'
import { analyzeContractionPattern, detectLaborPhase } from '@/utils/algorithms'

export interface LaborState {
  // Current labor session
  currentSession: LaborSession | null
  contractions: Contraction[]
  currentPattern: ContractionPattern | null
  anamnesisRecords: AnamnesisRecord[]
  alerts: LaborAlert[]
  
  // Phase tracking
  currentPhase: string
  phaseStartTime: string | null
  
  // UI state
  isMonitoring: boolean
  isLoading: boolean
  error: string | null
  
  // Actions - Session
  createSession: (userId: string) => LaborSession
  setCurrentSession: (session: LaborSession | null) => void
  endSession: (outcome?: string) => void
  
  // Actions - Contractions
  addContraction: (contraction: Contraction) => void
  removeContraction: (contractionId: string) => void
  updateContraction: (contractionId: string, updates: Partial<Contraction>) => void
  getContractions: () => Contraction[]
  
  // Actions - Pattern analysis
  updatePattern: () => void
  getPattern: () => ContractionPattern | null
  
  // Actions - Phase tracking
  updatePhase: () => void
  getPhase: () => string
  
  // Actions - Anamnesis
  addAnamnesisRecord: (record: AnamnesisRecord) => void
  getAnamnesisRecords: () => AnamnesisRecord[]
  
  // Actions - Alerts
  addAlert: (alert: LaborAlert) => void
  resolveAlert: (alertId: string) => void
  getAlerts: () => LaborAlert[]
  getActiveAlerts: () => LaborAlert[]
  
  // Actions - UI
  setMonitoring: (isMonitoring: boolean) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  
  // Actions - Utility
  reset: () => void
}

const initialState = {
  currentSession: null,
  contractions: [],
  currentPattern: null,
  anamnesisRecords: [],
  alerts: [],
  currentPhase: 'LATENT',
  phaseStartTime: null,
  isMonitoring: false,
  isLoading: false,
  error: null,
}

export const useLaborStore = create<LaborState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        createSession: (userId: string) => {
          const newSession: LaborSession = {
            id: crypto.randomUUID(),
            userId,
            startTime: new Date().toISOString(),
            phases: {},
            contractions: [],
            currentPattern: {
              averageInterval: 0,
              averageDuration: 0,
              regularityScore: 0,
              intensityTrend: 'stable',
              estimatedPhase: 'LATENT',
              confidence: 0,
            },
            anamnesisRecords: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          set({ currentSession: newSession })
          return newSession
        },

        setCurrentSession: (session: LaborSession | null) => {
          set({
            currentSession: session,
            contractions: session?.contractions || [],
            anamnesisRecords: session?.anamnesisRecords || [],
          })
        },

        endSession: (outcome?: string) => {
          const session = get().currentSession
          if (!session) return

          const updated: LaborSession = {
            ...session,
            endTime: new Date().toISOString(),
            outcome: outcome as any,
            completedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          set({ currentSession: updated })
        },

        addContraction: (contraction: Contraction) => {
          const contractions = [...get().contractions, contraction]
          set({ contractions })
          
          // Update pattern and phase automatically
          get().updatePattern()
          get().updatePhase()
          
          // Update session
          const session = get().currentSession
          if (session) {
            set({
              currentSession: {
                ...session,
                contractions,
                updatedAt: new Date().toISOString(),
              },
            })
          }
        },

        removeContraction: (contractionId: string) => {
          const contractions = get().contractions.filter(c => c.id !== contractionId)
          set({ contractions })
          get().updatePattern()
        },

        updateContraction: (contractionId: string, updates: Partial<Contraction>) => {
          const contractions = get().contractions.map(c =>
            c.id === contractionId ? { ...c, ...updates } : c
          )
          set({ contractions })
          get().updatePattern()
        },

        getContractions: () => {
          return get().contractions
        },

        updatePattern: () => {
          const contractions = get().contractions
          if (contractions.length < 2) return

          const pattern = analyzeContractionPattern(contractions)
          set({ currentPattern: pattern })
        },

        getPattern: () => {
          return get().currentPattern
        },

        updatePhase: () => {
          const contractions = get().contractions
          if (contractions.length === 0) return

          const phase = detectLaborPhase(contractions)
          const prevPhase = get().currentPhase

          if (phase !== prevPhase) {
            set({
              currentPhase: phase,
              phaseStartTime: new Date().toISOString(),
            })
          }
        },

        getPhase: () => {
          return get().currentPhase
        },

        addAnamnesisRecord: (record: AnamnesisRecord) => {
          const records = [...get().anamnesisRecords, record]
          set({ anamnesisRecords: records })

          const session = get().currentSession
          if (session) {
            set({
              currentSession: {
                ...session,
                anamnesisRecords: records,
                updatedAt: new Date().toISOString(),
              },
            })
          }

          // Check alert level
          if (record.alertLevel === 'RED') {
            const alert: LaborAlert = {
              id: crypto.randomUUID(),
              sessionId: session?.id || '',
              timestamp: new Date().toISOString(),
              alertLevel: 'RED',
              type: 'other',
              description: record.generalObservations || 'Alerta de anamnese',
              requiresHospitalization: record.requiresHospitalization,
            }
            get().addAlert(alert)
          }
        },

        getAnamnesisRecords: () => {
          return get().anamnesisRecords
        },

        addAlert: (alert: LaborAlert) => {
          const alerts = [...get().alerts, alert]
          set({ alerts })
        },

        resolveAlert: (alertId: string) => {
          const alerts = get().alerts.map(a =>
            a.id === alertId ? { ...a, resolvedAt: new Date().toISOString() } : a
          )
          set({ alerts })
        },

        getAlerts: () => {
          return get().alerts
        },

        getActiveAlerts: () => {
          return get().alerts.filter(a => !a.resolvedAt)
        },

        setMonitoring: (isMonitoring: boolean) => {
          set({ isMonitoring })
        },

        setLoading: (isLoading: boolean) => {
          set({ isLoading })
        },

        setError: (error: string | null) => {
          set({ error })
        },

        reset: () => {
          set(initialState)
        },
      }),
      {
        name: STORAGE_KEYS.LABOR_SESSION,
        version: 1,
      }
    )
  )
)
