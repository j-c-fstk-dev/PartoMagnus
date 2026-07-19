/**
 * App.tsx - Main application router and entry point
 */

import React, { useEffect } from 'react'
import { useAppStore } from '@/store/appStore'
import { useUserStore } from '@/store/userStore'
import { usePushNotifications } from '@/hooks/usePushNotifications'
import { initializeStorage } from '@/services/storageService'
import { logger } from '@/utils/logger'

// Screens
import { Onboarding } from '@/screens/Onboarding'
import { Anamnesis } from '@/screens/Anamnesis'
import { Home } from '@/screens/Home'
import { LaborTracking } from '@/screens/LaborTracking'
import { PostPartum } from '@/screens/PostPartum'
import { History } from '@/screens/History'
import { Settings } from '@/screens/Settings'

export const App: React.FC = () => {
  const isOnboarding = useAppStore(state => state.isOnboarding)
  const isLaboring = useAppStore(state => state.isLaboring)
  const isDarkMode = useAppStore(state => state.isDarkMode)
  const setOnline = useAppStore(state => state.setOnline)

  const user = useUserStore(state => state.user)
  const anamnesis = useUserStore(state => state.anamnesis)

  const { requestPermission, registerServiceWorker } = usePushNotifications()

  // Initialize app
  useEffect(() => {
    const init = async () => {
      logger.info('App: Initializing')

      // Setup storage
      await initializeStorage()

      // Setup dark mode
      if (isDarkMode) {
        document.documentElement.classList.add('dark')
      }

      // Setup online/offline tracking
      const handleOnline = () => setOnline(true)
      const handleOffline = () => setOnline(false)

      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)

      // Request notifications permission
      await requestPermission()

      // Register service worker
      await registerServiceWorker()

      logger.info('App: Initialization complete')

      return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
      }
    }

    init()
  }, [isDarkMode, setOnline, requestPermission, registerServiceWorker])

  // Route logic
  if (isOnboarding) {
    return <Onboarding />
  }

  if (!user) {
    return <Onboarding />
  }

  if (!anamnesis) {
    return <Anamnesis />
  }

  if (isLaboring) {
    return <LaborTracking />
  }

  // Default to home
  return <Home />
}

export default App
