/**
 * Global application state store (Zustand)
 * Manages overall app state, UI, and navigation
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface AppState {
  // UI State
  isDarkMode: boolean
  isOnboarding: boolean
  isLaboring: boolean
  currentPage: string
  
  // App metadata
  appVersion: string
  lastUpdated: string
  
  // Network state
  isOnline: boolean
  
  // Loading states
  isLoading: boolean
  loadingMessage: string
  
  // Modals
  openModals: string[]
  
  // Actions
  setDarkMode: (isDark: boolean) => void
  setOnboarding: (isOnboarding: boolean) => void
  setLaboring: (isLaboring: boolean) => void
  setCurrentPage: (page: string) => void
  setOnline: (isOnline: boolean) => void
  setLoading: (isLoading: boolean, message?: string) => void
  
  // Modal management
  openModal: (modalId: string) => void
  closeModal: (modalId: string) => void
  closeAllModals: () => void
  isModalOpen: (modalId: string) => boolean
  
  // Reset
  reset: () => void
}

const initialState = {
  isDarkMode: true,
  isOnboarding: true,
  isLaboring: false,
  currentPage: '/',
  appVersion: '0.1.0',
  lastUpdated: new Date().toISOString(),
  isOnline: navigator.onLine,
  isLoading: false,
  loadingMessage: '',
  openModals: [],
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setDarkMode: (isDark: boolean) => {
          set({ isDarkMode: isDark })
          if (isDark) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
        },

        setOnboarding: (isOnboarding: boolean) => {
          set({ isOnboarding })
        },

        setLaboring: (isLaboring: boolean) => {
          set({ isLaboring })
        },

        setCurrentPage: (page: string) => {
          set({ currentPage: page })
        },

        setOnline: (isOnline: boolean) => {
          set({ isOnline })
        },

        setLoading: (isLoading: boolean, message?: string) => {
          set({
            isLoading,
            loadingMessage: message || '',
          })
        },

        openModal: (modalId: string) => {
          const current = get().openModals
          if (!current.includes(modalId)) {
            set({ openModals: [...current, modalId] })
          }
        },

        closeModal: (modalId: string) => {
          set({
            openModals: get().openModals.filter(id => id !== modalId),
          })
        },

        closeAllModals: () => {
          set({ openModals: [] })
        },

        isModalOpen: (modalId: string) => {
          return get().openModals.includes(modalId)
        },

        reset: () => {
          set(initialState)
        },
      }),
      {
        name: 'app-store',
        version: 1,
      }
    )
  )
)
