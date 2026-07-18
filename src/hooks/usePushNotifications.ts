/**
 * Custom hook for push notifications management
 */

import { useState, useCallback, useEffect } from 'react'
import { NotificationPayload } from '@/types/index'
import { NotificationService } from '@/services/notificationService'
import { logger } from '@/utils/logger'

export interface NotificationState {
  isEnabled: boolean
  isSupported: boolean
  permissionStatus: 'granted' | 'denied' | 'default'
  error: string | null
}

export function usePushNotifications() {
  const [state, setState] = useState<NotificationState>({
    isEnabled: false,
    isSupported: 'Notification' in window,
    permissionStatus: 'default',
    error: null,
  })

  const [scheduledTimers, setScheduledTimers] = useState<NodeJS.Timeout[]>([])
  const [badgeCount, setBadgeCount] = useState(0)

  /**
   * Request notification permission
   */
  const requestPermission = useCallback(async () => {
    try {
      const granted = await NotificationService.requestPermission()
      setState(prev => ({
        ...prev,
        isEnabled: granted,
        permissionStatus: granted ? 'granted' : 'denied',
        error: null,
      }))

      if (granted) {
        logger.info('usePushNotifications: Permission granted')
        return true
      } else {
        logger.warn('usePushNotifications: Permission denied')
        return false
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to request permission'
      setState(prev => ({
        ...prev,
        error: errorMsg,
      }))
      logger.error('usePushNotifications: Permission request failed', error)
      return false
    }
  }, [])

  /**
   * Send notification
   */
  const sendNotification = useCallback(
    async (payload: NotificationPayload) => {
      try {
        if (!state.isEnabled) {
          setState(prev => ({
            ...prev,
            error: 'Notificações não estão ativadas',
          }))
          return false
        }

        await NotificationService.sendNotification(payload)
        setState(prev => ({ ...prev, error: null }))
        logger.info('usePushNotifications: Notification sent', { title: payload.title })
        return true
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Failed to send notification'
        setState(prev => ({
          ...prev,
          error: errorMsg,
        }))
        logger.error('usePushNotifications: Failed to send notification', error)
        return false
      }
    },
    [state.isEnabled]
  )

  /**
   * Notify phase change
   */
  const notifyPhaseChange = useCallback(async (phase: string) => {
    await NotificationService.notifyPhaseChange(phase)
  }, [])

  /**
   * Send affirmation
   */
  const sendAffirmation = useCallback(async (affirmation: string) => {
    await NotificationService.sendAffirmation(affirmation)
  }, [])

  /**
   * Remind hydration
   */
  const remindHydration = useCallback(async () => {
    await NotificationService.remindHydration()
  }, [])

  /**
   * Remind movement
   */
  const remindMovement = useCallback(async () => {
    await NotificationService.remindMovement()
  }, [])

  /**
   * Send alert
   */
  const sendAlert = useCallback(async (alertType: string, message: string) => {
    await NotificationService.sendAlert(alertType, message)
  }, [])

  /**
   * Send emergency notification
   */
  const sendEmergency = useCallback(async (message: string) => {
    await NotificationService.sendEmergency(message)
  }, [])

  /**
   * Schedule phase notifications
   */
  const schedulePhaseNotifications = useCallback((phase: string) => {
    try {
      // Cancel previous timers
      scheduledTimers.forEach(timer => clearInterval(timer))

      // Schedule new notifications
      const timers = NotificationService.schedulePhaseNotifications(phase)
      setScheduledTimers(timers)
      logger.info('usePushNotifications: Phase notifications scheduled', {
        phase,
        count: timers.length,
      })
    } catch (error) {
      logger.error('usePushNotifications: Failed to schedule notifications', error)
    }
  }, [scheduledTimers])

  /**
   * Cancel scheduled notifications
   */
  const cancelScheduledNotifications = useCallback(() => {
    try {
      NotificationService.cancelScheduledNotifications(scheduledTimers)
      setScheduledTimers([])
      logger.info('usePushNotifications: Scheduled notifications cancelled')
    } catch (error) {
      logger.error('usePushNotifications: Failed to cancel notifications', error)
    }
  }, [scheduledTimers])

  /**
   * Set badge count
   */
  const setBadge = useCallback(async (count: number) => {
    try {
      await NotificationService.setBadgeCount(count)
      setBadgeCount(count)
      logger.debug('usePushNotifications: Badge set', { count })
    } catch (error) {
      logger.error('usePushNotifications: Failed to set badge', error)
    }
  }, [])

  /**
   * Register service worker
   */
  const registerServiceWorker = useCallback(async () => {
    try {
      const registration = await NotificationService.registerServiceWorker()
      if (registration) {
        logger.info('usePushNotifications: Service Worker registered')
        return true
      }
      return false
    } catch (error) {
      logger.error('usePushNotifications: Service Worker registration failed', error)
      return false
    }
  }, [])

  /**
   * Get permission status
   */
  const getPermissionStatus = useCallback(() => {
    return NotificationService.getPermissionStatus()
  }, [])

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    cancelScheduledNotifications()
    setState({
      isEnabled: false,
      isSupported: 'Notification' in window,
      permissionStatus: 'default',
      error: null,
    })
    setBadgeCount(0)
  }, [cancelScheduledNotifications])

  /**
   * Auto-register service worker on mount
   */
  useEffect(() => {
    if (state.isSupported) {
      registerServiceWorker()
    }
  }, [state.isSupported, registerServiceWorker])

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      cancelScheduledNotifications()
    }
  }, [cancelScheduledNotifications])

  return {
    // State
    ...state,
    badgeCount,
    scheduledTimers,

    // Actions
    requestPermission,
    sendNotification,
    notifyPhaseChange,
    sendAffirmation,
    remindHydration,
    remindMovement,
    sendAlert,
    sendEmergency,
    schedulePhaseNotifications,
    cancelScheduledNotifications,
    setBadge,
    registerServiceWorker,
    reset,

    // Queries
    getPermissionStatus,
  }
}
